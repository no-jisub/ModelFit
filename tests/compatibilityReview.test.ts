import { describe, expect, it } from "vitest";
import { loadRawCatalog, validateRawCatalog } from "../scripts/lib/catalog-schema";
import {
  applyCompatibilityReview,
  type CompatibilityDecision,
} from "../scripts/lib/compatibility-review";

async function fixture() {
  const raw = await loadRawCatalog();
  const relation = raw["model-consumables.csv"].find(
    (r) => r.verificationStatus === "official" && r.evidenceScope === "scoped",
  )!;
  const sourceId = raw["compatibility-sources.csv"].find(
    (j) => j.compatibilityId === relation.id,
  )!.sourceId;
  const decision: CompatibilityDecision = {
    compatibilityId: relation.id,
    status: "official",
    reviewedAt: "2026-10-02",
    sourceIds: [sourceId],
    note: "공식 적용 목록에서 정확한 모델과 부품을 대조함.",
  };
  return { raw, relation, sourceId, decision };
}
describe("compatibility evidence review", () => {
  it("applies model-scoped evidence without changing IDs or mutating its input", async () => {
    const { raw, relation, decision } = await fixture();
    const original = JSON.stringify(raw);
    const result = applyCompatibilityReview(raw, [decision]);
    expect(JSON.stringify(raw)).toBe(original);
    expect(result["model-consumables.csv"].find((r) => r.id === relation.id)).toMatchObject({
      evidenceScope: "scoped",
      verificationStatus: "official",
      verifiedAt: "2026-10-02",
    });
    expect(result["purchase-links.csv"]).toEqual(raw["purchase-links.csv"]);
  });
  it("removes prior confirmed joins when evidence is insufficient and preserves historical dates", async () => {
    const { raw, relation, decision } = await fixture();
    const next = applyCompatibilityReview(raw, [
      {
        ...decision,
        status: "unverified",
        sourceIds: [],
        note: "정확한 적용 모델을 확인하지 못함.",
      },
    ]);
    expect(next["compatibility-sources.csv"].some((j) => j.compatibilityId === relation.id)).toBe(
      false,
    );
    expect(next["model-consumables.csv"].find((r) => r.id === relation.id)).toMatchObject({
      verificationStatus: "unverified",
      evidenceScope: "legacy-unscoped",
      verifiedAt: relation.verifiedAt,
    });
  });
  it("rejects missing evidence, duplicate reviews and invalid calendar dates before applying", async () => {
    const { raw, decision } = await fixture();
    expect(() => applyCompatibilityReview(raw, [{ ...decision, sourceIds: [] }])).toThrow(
      "근거 출처",
    );
    expect(() => applyCompatibilityReview(raw, [decision, decision])).toThrow("중복");
    expect(() =>
      applyCompatibilityReview(raw, [{ ...decision, reviewedAt: "2026-02-30" }]),
    ).toThrow("날짜");
  });
  it("rejects seller, inactive and manufacturer-lookalike URLs as official relationship proof", async () => {
    for (const change of [
      { sourceType: "seller" },
      { isActive: "false" },
      { url: "https://lge.co.kr.evil.example/filter" },
    ]) {
      const { raw, sourceId, decision } = await fixture();
      Object.assign(
        raw["sources.csv"].find((s) => s.id === sourceId)!,
        change,
      );
      expect(() => applyCompatibilityReview(raw, [decision])).toThrow();
      expect(validateRawCatalog(raw).join("\n")).toContain("active manufacturer evidence");
    }
  });
});
