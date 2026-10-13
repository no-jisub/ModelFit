import { mkdir, writeFile } from "node:fs/promises";
import { loadRawCatalog } from "./lib/catalog-schema";

const raw = await loadRawCatalog();
const rows = raw["model-consumables.csv"].map((relation) => {
  const model = raw["models.csv"].find((row) => row.id === relation.modelId)!;
  const part = raw["consumables.csv"].find((row) => row.id === relation.consumableId)!;
  const options = raw["product-options.csv"].filter(
    (row) => row.consumableId === part.id && row.isActive === "true",
  );
  const links = raw["purchase-links.csv"].filter(
    (row) => options.some((option) => option.id === row.productOptionId) && row.isActive === "true",
  );
  const missing = [];
  if (relation.verificationStatus !== "official" || relation.evidenceScope !== "scoped")
    missing.push("모델별 공식 호환 근거 미확인");
  if (!part.genuinePartNumber)
    missing.push("등록 자료에 정품 교체 품번 없음 — 제조사의 미공개 여부를 단정하지 않음");
  if (!relation.requiredQuantity)
    missing.push("장착 수량 근거 미등록 — 판매 수량으로 추정하지 않음");
  if (!links.length)
    missing.push("활성 구매 링크 없음 — 참고 페이지·해외 배송·세트 여부를 별도 확인");
  const incompleteOptions = options
    .filter((option) => links.some((link) => link.productOptionId === option.id))
    .filter(
      (option) =>
        !option.packageLabel &&
        !raw["option-model-labels.csv"].some(
          (label) => label.productOptionId === option.id && label.modelId === model.id,
        ),
    )
    .map((option) => option.id);
  if (incompleteOptions.length) missing.push("구매 가능한 일부 상품의 판매 구성 미등록");
  return {
    compatibilityId: relation.id,
    modelCode: model.modelCode,
    partId: part.id,
    partName: part.displayName,
    verificationStatus: relation.verificationStatus,
    reviewNote: relation.fitNote || "추가 근거 확인 필요",
    missing,
    incompleteOptions,
    purchaseUrls: links.map((link) => link.url),
  };
});
const summary = {
  generatedAt: new Date().toISOString(),
  totalRelations: rows.length,
  unverifiedRelations: rows.filter((row) => row.verificationStatus === "unverified").length,
  sellerConfirmedRelations: rows.filter((row) => row.verificationStatus === "seller-confirmed")
    .length,
  partTypesWithoutPurchase: new Set(
    rows.filter((row) => !row.purchaseUrls.length).map((row) => row.partId),
  ).size,
  relationsWithInformationGaps: rows.filter((row) => row.missing.length).length,
  fullyPopulatedRelations: rows.filter((row) => !row.missing.length).length,
  note: "등록 정보의 누락 검사입니다. 자료 조사 완료·실물 호환 검증·상품의 현재 재고를 의미하지 않습니다.",
};
await mkdir("outputs/catalog-review", { recursive: true });
await writeFile(
  "outputs/catalog-review/completeness.json",
  JSON.stringify({ summary, rows }, null, 2) + "\n",
);
await writeFile(
  "outputs/catalog-review/completeness.md",
  [
    "# 소모품·구매처 완성도 확인",
    "",
    summary.note,
    "",
    `전체 연결 ${summary.totalRelations}건 · 미검증 ${summary.unverifiedRelations}건 · 구매 링크 없는 부품 유형 ${summary.partTypesWithoutPurchase}개`,
    `정보 누락이 남은 연결 ${summary.relationsWithInformationGaps}건 · 검사 대상 필드가 채워진 연결 ${summary.fullyPopulatedRelations}건`,
    "",
    ...rows
      .filter((row) => row.missing.length)
      .flatMap((row) => [
        `## ${row.modelCode} / ${row.partName}`,
        "",
        ...row.missing.map((missing) => `- ${missing}`),
        "",
        row.reviewNote,
        "",
      ]),
  ].join("\n"),
);
console.log(JSON.stringify(summary, null, 2));
