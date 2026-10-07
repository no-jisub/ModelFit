import { mkdir, writeFile } from "node:fs/promises";
import { models } from "../src/data/models";
import { consumables } from "../src/data/consumables";
import { isOfficialCompatibility } from "../src/utils/compatibility";

// Review output is private operational data. Never update a verification date from HTTP status.
const rows = consumables
  .flatMap((part) =>
    part.compatibilities.map((relation) => {
      const model = models.find((item) => item.id === relation.modelId)!;
      const hasPurchase = part.productOptions.some((option) => option.purchaseLinks.length > 0);
      const shared = part.compatibilities.length > 1;
      const confirmed = isOfficialCompatibility(relation);
      const missingPackage = part.productOptions
        .filter(
          (option) =>
            option.purchaseLinks.length > 0 &&
            !option.modelLabels[model.id] &&
            !option.packageLabel,
        )
        .map((option) => option.id);
      return {
        compatibilityId: relation.id,
        modelId: model.id,
        brand: model.brandName,
        modelCode: model.modelCode,
        partId: part.id,
        partName: part.displayName,
        confirmed,
        hasPurchase,
        shared,
        priority: (!confirmed ? 100 : 0) + (hasPurchase ? 20 : 0) + (shared ? 10 : 0),
        missingQuantity: !relation.configuration?.requiredQuantity,
        missingPackage,
        verificationStatus: relation.verificationStatus,
        evidenceScope: relation.evidenceScope,
        sourceUrls: [
          ...new Set(
            [
              ...relation.sources,
              ...part.sources,
              ...model.sources,
              ...part.productOptions.flatMap((option) => option.sources),
            ].map((source) => source.url),
          ),
        ],
      };
    }),
  )
  .sort((a, b) => b.priority - a.priority || a.compatibilityId.localeCompare(b.compatibilityId));

const pending = rows.filter((row) => !row.confirmed);
const summary = {
  generatedAt: new Date().toISOString(),
  totalRelations: rows.length,
  confirmedRelations: rows.length - pending.length,
  pendingRelations: pending.length,
  pendingWithPurchase: pending.filter((row) => row.hasPurchase).length,
  pendingSharedParts: pending.filter((row) => row.shared).length,
  relationsWithoutQuantity: rows.filter((row) => row.missingQuantity).length,
  optionsWithoutPackage: new Set(rows.flatMap((row) => row.missingPackage)).size,
  byBrand: [...new Set(rows.map((row) => row.brand))].map((brand) => ({
    brand,
    total: rows.filter((row) => row.brand === brand).length,
    pending: pending.filter((row) => row.brand === brand).length,
  })),
};
await mkdir("outputs/catalog-review", { recursive: true });
await writeFile(
  "outputs/catalog-review/report.json",
  JSON.stringify({ summary, pending, rows }, null, 2) + "\n",
);
await writeFile(
  "outputs/catalog-review/report.md",
  [
    "# 카탈로그 검토 현황",
    "",
    `생성: ${summary.generatedAt}`,
    "",
    `전체 ${summary.totalRelations} · 공식 호환 확인 ${summary.confirmedRelations} · 확인 필요 ${summary.pendingRelations}`,
    `미확인 중 구매 링크 연결 ${summary.pendingWithPurchase} · 공유 부품 ${summary.pendingSharedParts} (중복 포함)`,
    "",
    "누락된 수량·판매 구성은 오류 확정이 아닌 확인 대기 항목입니다. 자료를 확인하기 전 값을 추정하지 않습니다.",
    "이 보고서는 저장된 데이터 검사이며 제조사 자료 전체를 재검증했다는 뜻이 아닙니다.",
    "",
    "| 브랜드 | 관계 | 확인 필요 |",
    "| --- | ---: | ---: |",
    ...summary.byBrand.map((row) => `| ${row.brand} | ${row.total} | ${row.pending} |`),
    "",
    "## 우선 검토 20건",
    "",
    ...pending
      .slice(0, 20)
      .map(
        (row) =>
          `- ${row.brand} ${row.modelCode} / ${row.partName} — 구매 링크 ${row.hasPurchase ? "있음" : "없음"}, ${row.shared ? "공유 부품" : "단일 모델"} (${row.compatibilityId})`,
      ),
    "",
    "전체 대기열과 후보 출처는 report.json을 참고합니다. 판정 변경은 기존 catalog:compatibility:review의 미리보기·백업·적용 절차를 따릅니다.",
    "",
  ].join("\n"),
);
console.log(JSON.stringify(summary, null, 2));
