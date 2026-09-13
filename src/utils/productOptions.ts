import type { ConsumableCompatibility, ConsumableProductOption, PurchaseLinkData } from "../types";

type ProductOptionSource = Pick<
  ConsumableCompatibility,
  | "id"
  | "displayName"
  | "compatibleProductName"
  | "genuinePartNumber"
  | "verificationStatus"
  | "sources"
  | "affiliate"
>;

export function createProductOptions(
  part: ProductOptionSource,
  purchaseLinks: PurchaseLinkData[],
): ConsumableProductOption[] {
  const productSpecificLinks = purchaseLinks.filter((link) => link.linkType !== "search-results");
  const candidate = part.affiliate.productOption;
  const candidateLinks = candidate
    ? productSpecificLinks.filter((link) => link.channel === "coupang")
    : [];
  const genuineLinks = candidate
    ? productSpecificLinks.filter((link) => link.channel !== "coupang")
    : productSpecificLinks;
  const verification =
    part.verificationStatus === "official"
      ? ("official-genuine" as const)
      : part.verificationStatus === "seller-confirmed"
        ? ("seller-claimed" as const)
        : ("unverified" as const);
  const partNumberDescription = part.genuinePartNumber
    ? ` 정품 부품번호는 ${part.genuinePartNumber}입니다.`
    : "";

  const options: ConsumableProductOption[] = [
    {
      id: `${part.id}-genuine-option`,
      name: part.displayName,
      kind: "genuine",
      verification,
      description:
        (part.verificationStatus === "official"
          ? "제조사 공식 자료에서 확인한 소모품의 규격·호환 정보입니다. 외부 판매 상품의 진품 여부는 판매자와 적용 모델을 별도로 확인하세요."
          : "이 소모품의 정품 여부와 모델 호환 관계는 추가 확인이 필요합니다.") +
        partNumberDescription,
      partNumber: part.genuinePartNumber,
      packageLabel:
        part.compatibleProductName && part.compatibleProductName !== part.displayName
          ? part.compatibleProductName
          : undefined,
      sources: part.sources,
      purchaseLinks: genuineLinks,
    },
  ];

  if (candidate && candidateLinks.length > 0) {
    options.push({
      id: `${part.id}-${candidate.kind}-candidate-option`,
      name: candidate.name,
      kind: candidate.kind,
      verification: candidate.verification,
      description: candidate.description,
      partNumber: candidate.partNumber,
      packageLabel: candidate.packageLabel,
      sources: [],
      purchaseLinks: candidateLinks,
    });
  }

  return options;
}
