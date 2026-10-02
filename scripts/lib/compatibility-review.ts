import type { RawCatalog } from "./catalog-schema";
import { validateRawCatalog } from "./catalog-schema";

export interface CompatibilityDecision {
  compatibilityId: string;
  status: "official" | "unverified";
  reviewedAt: string;
  sourceIds: string[];
  note: string;
}

export function applyCompatibilityReview(
  raw: RawCatalog,
  decisions: CompatibilityDecision[],
): RawCatalog {
  const next = structuredClone(raw);
  const seen = new Set<string>();
  for (const decision of decisions) {
    const relation = next["model-consumables.csv"].find((r) => r.id === decision.compatibilityId);
    if (!relation || seen.has(decision.compatibilityId))
      throw new Error("알 수 없거나 중복된 호환 관계: " + decision.compatibilityId);
    seen.add(decision.compatibilityId);
    if (
      !["official", "unverified"].includes(decision.status) ||
      !decision.note?.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(decision.reviewedAt) ||
      Number.isNaN(Date.parse(decision.reviewedAt)) ||
      new Date(decision.reviewedAt).toISOString().slice(0, 10) !== decision.reviewedAt
    )
      throw new Error("검토 상태·날짜·사유가 올바르지 않습니다.");
    if (
      !Array.isArray(decision.sourceIds) ||
      new Set(decision.sourceIds).size !== decision.sourceIds.length
    )
      throw new Error("근거 출처 목록이 올바르지 않습니다.");
    if (decision.status === "official" && !decision.sourceIds.length)
      throw new Error("공식 확인에는 모델별 근거 출처가 필요합니다.");
    if (decision.status === "unverified" && decision.sourceIds.length)
      throw new Error("미확인 후보 출처는 검토 기록에만 보관하세요.");
    const model = next["models.csv"].find((m) => m.id === relation.modelId)!;
    const domains = next["brand-domains.csv"]
      .filter((d) => d.brandId === model.brandId)
      .map((d) => d.domain);
    for (const id of decision.sourceIds) {
      const source = next["sources.csv"].find((s) => s.id === id);
      if (
        !source ||
        source.isActive !== "true" ||
        !["manufacturer", "official-manual", "official-store"].includes(source.sourceType)
      )
        throw new Error("활성 공식 출처가 아닙니다: " + id);
      const host = new URL(source.url).hostname;
      if (!domains.some((d) => host === d || host.endsWith("." + d)))
        throw new Error("제조사 도메인과 다른 출처입니다: " + id);
      if (decision.reviewedAt < source.checkedAt)
        throw new Error("기존 출처 확인일보다 이전인 검토입니다.");
      source.checkedAt = decision.reviewedAt;
    }
    relation.verificationStatus = decision.status;
    relation.evidenceScope = decision.status === "official" ? "scoped" : "legacy-unscoped";
    if (decision.status === "official") relation.verifiedAt = decision.reviewedAt;
    next["compatibility-sources.csv"] = next["compatibility-sources.csv"].filter(
      (j) => j.compatibilityId !== relation.id,
    );
    next["compatibility-sources.csv"].push(
      ...decision.sourceIds.map((sourceId) => ({ compatibilityId: relation.id, sourceId })),
    );
  }
  const errors = validateRawCatalog(next);
  if (errors.length) throw new Error(errors.join("\n"));
  return next;
}
