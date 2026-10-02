import { readFile, writeFile, mkdir } from "node:fs/promises";
import { loadRawCatalog, catalogSchema, encodeCsv, type CatalogFile } from "./lib/catalog-schema";
import { applyCompatibilityReview, type CompatibilityDecision } from "./lib/compatibility-review";

const raw = await loadRawCatalog();
const fromIndex = process.argv.indexOf("--from");
if (fromIndex >= 0) {
  const file = process.argv[fromIndex + 1];
  if (!file) throw new Error("--from 검토 기록 경로가 필요합니다.");
  const decisions = JSON.parse(await readFile(file, "utf8")) as CompatibilityDecision[];
  const next = applyCompatibilityReview(raw, decisions);
  if (process.argv.includes("--apply")) {
    for (const name of [
      "model-consumables.csv",
      "compatibility-sources.csv",
      "sources.csv",
    ] as CatalogFile[])
      await writeFile("data/catalog/" + name, encodeCsv(catalogSchema[name], next[name]), "utf8");
  }
  console.log(
    `호환 검토 ${decisions.length}건: 공식 ${decisions.filter((d) => d.status === "official").length}, 미확인 ${decisions.filter((d) => d.status === "unverified").length} (${process.argv.includes("--apply") ? "적용" : "미리보기"})`,
  );
} else {
  const queue = raw["model-consumables.csv"]
    .map((relation) => {
      const model = raw["models.csv"].find((m) => m.id === relation.modelId)!;
      const part = raw["consumables.csv"].find((p) => p.id === relation.consumableId)!;
      const optionIds = raw["product-options.csv"]
        .filter((o) => o.consumableId === part.id && o.isActive === "true")
        .map((o) => o.id);
      const hasPurchase = raw["purchase-links.csv"].some(
        (l) => optionIds.includes(l.productOptionId) && l.isActive === "true",
      );
      const shared = raw["model-consumables.csv"].filter((r) => r.consumableId === part.id).length;
      const sourceIds = [
        ...new Set(
          [
            ...raw["consumable-sources.csv"].filter((j) => j.consumableId === part.id),
            ...raw["model-sources.csv"].filter((j) => j.modelId === model.id),
            ...raw["product-option-sources.csv"].filter((j) =>
              optionIds.includes(j.productOptionId),
            ),
          ].map((j) => j.sourceId),
        ),
      ];
      return {
        compatibilityId: relation.id,
        modelCode: model.modelCode,
        partName: part.displayName,
        hasPurchase,
        shared,
        priority: (hasPurchase ? 100 : 0) + (shared > 1 ? 50 : 0) + shared,
        status: relation.verificationStatus,
        evidenceScope: relation.evidenceScope,
        candidateSourceIds: sourceIds,
      };
    })
    .sort((a, b) => b.priority - a.priority || a.compatibilityId.localeCompare(b.compatibilityId));
  await mkdir("outputs/compatibility", { recursive: true });
  await writeFile("outputs/compatibility/review-queue.json", JSON.stringify(queue, null, 2) + "\n");
  console.log(
    `검토 대기열 ${queue.length}건 (구매 링크 ${queue.filter((r) => r.hasPurchase).length}, 공유 부품 ${queue.filter((r) => r.shared > 1).length})`,
  );
}
