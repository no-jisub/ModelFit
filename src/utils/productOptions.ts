import type { ConsumableCompatibility, ConsumableProductOption, PurchaseLinkData } from "../types";

type ProductOptionSource = Pick<
  ConsumableCompatibility,
  | "id"
  | "displayName"
  | "compatibleProductName"
  | "genuinePartNumber"
  | "verificationStatus"
  | "sources"
>;

export function createProductOptions(
  part: ProductOptionSource,
  purchaseLinks: PurchaseLinkData[],
): ConsumableProductOption[] {
  const productSpecificLinks = purchaseLinks.filter((link) => link.linkType !== "search-results");
  const verification =
    part.verificationStatus === "official"
      ? ("official-genuine" as const)
      : part.verificationStatus === "seller-confirmed"
        ? ("seller-claimed" as const)
        : ("unverified" as const);
  const partNumberDescription = part.genuinePartNumber
    ? ` 정품 부품번호는 ${part.genuinePartNumber}입니다.`
    : "";

  return [
    {
      id: `${part.id}-genuine-option`,
      name: part.displayName,
      kind: "genuine",
      verification,
      description:
        "제조사 공식 자료에서 이 소모품과 모델의 호환 관계를 확인한 정품 기준 상품입니다." +
        partNumberDescription,
      partNumber: part.genuinePartNumber,
      packageLabel:
        part.compatibleProductName && part.compatibleProductName !== part.displayName
          ? part.compatibleProductName
          : undefined,
      sources: part.sources,
      purchaseLinks: productSpecificLinks,
    },
  ];
}
