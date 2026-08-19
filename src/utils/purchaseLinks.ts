import type { ConsumableCompatibility, PurchaseLinkData, SourceReference } from "../types";
import { buildAffiliateUrl } from "./affiliate";

const officialSourceTypes = new Set<SourceReference["sourceType"]>([
  "manufacturer",
  "official-manual",
  "official-store",
]);

type PurchaseLinkSource = Pick<ConsumableCompatibility, "id" | "sources" | "affiliate"> & {
  purchaseLinks?: PurchaseLinkData[];
};

function isSafeExternalUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function primaryOfficialSource(part: PurchaseLinkSource) {
  return (
    part.sources.find((source) => source.sourceType === "official-store") ??
    part.sources.find((source) => officialSourceTypes.has(source.sourceType))
  );
}

export function createPurchaseLinks(part: PurchaseLinkSource): PurchaseLinkData[] {
  const links: PurchaseLinkData[] = [];
  const officialSource = primaryOfficialSource(part);

  if (officialSource && isSafeExternalUrl(officialSource.url)) {
    links.push({
      id: `${part.id}-official`,
      label:
        officialSource.sourceType === "official-store"
          ? "공식 사이트에서 확인"
          : "공식 호환 근거 확인",
      url: officialSource.url,
      channel: "official",
      linkType: "official-reference",
      isAffiliate: false,
      checkedAt: officialSource.checkedAt,
    });
  }

  const isDirectProduct = part.affiliate.status === "direct-product";
  const searchKeyword = part.affiliate.searchKeyword.includes("정품")
    ? part.affiliate.searchKeyword
    : `${part.affiliate.searchKeyword} 정품`;
  const generatedSearchUrl = buildAffiliateUrl(undefined, searchKeyword);
  const coupangUrl = isDirectProduct ? part.affiliate.directUrl : generatedSearchUrl;

  if (part.affiliate.enabled && coupangUrl && isSafeExternalUrl(coupangUrl)) {
    links.push({
      id: `${part.id}-coupang`,
      label: isDirectProduct ? "쿠팡 상품 확인" : "쿠팡 일반 검색",
      url: coupangUrl,
      channel: "coupang",
      linkType: isDirectProduct ? "direct-product" : "search-results",
      isAffiliate: part.affiliate.isAffiliate,
      checkedAt: part.affiliate.linkCheckedAt,
    });
  }

  for (const [index, source] of part.sources
    .filter((item) => item.sourceType === "seller" && isSafeExternalUrl(item.url))
    .entries()) {
    links.push({
      id: `${part.id}-other-${index + 1}`,
      label: source.title,
      url: source.url,
      channel: "other",
      linkType: "direct-product",
      isAffiliate: false,
      checkedAt: source.checkedAt,
    });
  }

  return links;
}

export function getPurchaseLinks(
  part: PurchaseLinkSource,
  configuredCoupangBaseUrl?: string,
): PurchaseLinkData[] {
  const links = part.purchaseLinks ?? createPurchaseLinks(part);
  const configuredBase = configuredCoupangBaseUrl?.trim();
  if (!configuredBase) return links;

  const searchKeyword = part.affiliate.searchKeyword.includes("정품")
    ? part.affiliate.searchKeyword
    : `${part.affiliate.searchKeyword} 정품`;
  const configuredUrl = buildAffiliateUrl(configuredBase, searchKeyword);
  if (!configuredUrl) return links;

  return links.map((link) =>
    link.channel === "coupang" && link.linkType === "search-results"
      ? { ...link, url: configuredUrl, isAffiliate: true }
      : link,
  );
}
