import type { ConsumableCompatibility, SourceReference } from "@/types";

const checkedAt = "2026-07-29";
export const regionalWarning =
  "제조사 공식 자료로 호환 모델을 확인했습니다. 국가별 판매 구성이나 부품 사양이 다를 수 있으므로 구매 직전 제품 라벨의 모델명과 판매 페이지의 적용 모델을 다시 대조하세요. 쿠팡 상품명만으로 정품을 단정하지 말고 판매자와 제조사 표기도 확인하세요.";
export const domesticWarning =
  "제조사 공식 자료로 호환 모델을 확인했습니다. 구매 직전 제품 라벨의 모델명과 부품번호 또는 공식 적용 모델을 다시 대조하세요. 쿠팡 상품명만으로 정품을 단정하지 말고 판매자와 제조사 표기도 확인하세요.";

export const source = (
  title: string,
  url: string,
  sourceType: SourceReference["sourceType"] = "official-store",
  verifiedAt = checkedAt,
): SourceReference => ({ title, url, sourceType, checkedAt: verifiedAt });

export const coupangSearch = (keyword: string) =>
  `https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`;

export const affiliate = (
  searchKeyword: string,
  directUrl?: string,
  verifiedAt = checkedAt,
  restrictionNote?: string,
) => {
  const resolvedUrl = directUrl ?? coupangSearch(searchKeyword);
  const isAffiliate = resolvedUrl.startsWith("https://link.coupang.com/a/");

  return {
    searchKeyword,
    directUrl: resolvedUrl,
    isAffiliate,
    restrictionNote,
    enabled: true,
    status:
      resolvedUrl.includes("/vp/products/") || isAffiliate
        ? ("direct-product" as const)
        : ("search-results" as const),
    priceStatus: "manual-check-required" as const,
    stockStatus: "manual-check-required" as const,
    linkCheckedAt: verifiedAt,
  };
};

export const unavailableAffiliate = (searchKeyword: string, verifiedAt = checkedAt) => ({
  searchKeyword,
  directUrl: undefined,
  isAffiliate: false,
  enabled: false,
  status: "unavailable" as const,
  priceStatus: "manual-check-required" as const,
  stockStatus: "manual-check-required" as const,
  linkCheckedAt: verifiedAt,
});

export const researchedPart = ({
  id,
  type,
  displayName,
  modelIds,
  sourceTitle,
  sourceUrl,
  searchKeyword,
  sourceType = "official-store",
  compatibleProductName,
  genuinePartNumber,
  replacementInterval,
  regional = false,
  verifiedAt = checkedAt,
  secondarySources = [],
  directUrl,
  purchaseUnavailable = false,
}: {
  id: string;
  type: ConsumableCompatibility["type"];
  displayName: string;
  modelIds: string[];
  sourceTitle: string;
  sourceUrl: string;
  searchKeyword: string;
  sourceType?: SourceReference["sourceType"];
  compatibleProductName?: string;
  genuinePartNumber?: string;
  replacementInterval?: string;
  regional?: boolean;
  verifiedAt?: string;
  secondarySources?: Array<{
    title: string;
    url: string;
    sourceType?: SourceReference["sourceType"];
  }>;
  directUrl?: string;
  purchaseUnavailable?: boolean;
}): ConsumableRecord => ({
  id,
  slug: id,
  type,
  displayName,
  compatibleProductName,
  genuinePartNumber,
  compatibleModelIds: modelIds,
  searchKeywords: [searchKeyword, displayName],
  replacementInterval,
  purchaseWarning: regional ? regionalWarning : domesticWarning,
  verificationStatus: "official",
  sources: [
    source(sourceTitle, sourceUrl, sourceType, verifiedAt),
    ...secondarySources.map((item) =>
      source(item.title, item.url, item.sourceType ?? "official-store", verifiedAt),
    ),
  ],
  affiliate: purchaseUnavailable
    ? unavailableAffiliate(searchKeyword, verifiedAt)
    : affiliate(searchKeyword, directUrl, verifiedAt),
});

export type ConsumableRecord = Omit<
  ConsumableCompatibility,
  "partNumberStatus" | "purchaseLinks" | "productOptions"
> & {
  partNumberStatus?: ConsumableCompatibility["partNumberStatus"];
  productOptions?: ConsumableCompatibility["productOptions"];
};
