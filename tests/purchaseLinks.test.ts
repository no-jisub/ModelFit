import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { getPurchaseLinks } from "../src/utils/purchaseLinks";

describe("getPurchaseLinks", () => {
  const affiliateDirectPart = consumables.find(
    (part) => part.affiliate.status === "direct-product" && part.affiliate.isAffiliate,
  );
  const nonAffiliateDirectPart = consumables.find(
    (part) => part.affiliate.status === "direct-product" && !part.affiliate.isAffiliate,
  );
  const searchPart = consumables.find((part) => part.affiliate.status === "search-results");

  it("공식 사이트를 쿠팡보다 먼저 배치한다", () => {
    expect(searchPart).toBeDefined();
    const links = getPurchaseLinks(searchPart!);

    expect(links[0]?.channel).toBe("official");
    expect(links[1]?.channel).toBe("coupang");
  });

  it("기본 쿠팡 검색 링크는 비제휴로 생성한다", () => {
    const coupangLink = getPurchaseLinks(searchPart!).find((link) => link.channel === "coupang");

    expect(coupangLink?.url).toContain("https://www.coupang.com/np/search?q=");
    expect(coupangLink?.isAffiliate).toBe(false);
    expect(coupangLink?.linkType).toBe("search-results");
  });

  it("직접 상품 링크는 설정된 검색 URL로 덮어쓰지 않는다", () => {
    expect(affiliateDirectPart).toBeDefined();
    const coupangLink = getPurchaseLinks(
      affiliateDirectPart!,
      "https://link.coupang.com/re/AFFSDP?lptag=test",
    ).find((link) => link.channel === "coupang");

    expect(coupangLink?.linkType).toBe("direct-product");
    expect(coupangLink?.isAffiliate).toBe(true);
    expect(coupangLink?.url).toBe(affiliateDirectPart?.affiliate.directUrl);
  });

  it("제휴 생성 제한 상품은 일반 상품 링크를 유지한다", () => {
    expect(nonAffiliateDirectPart).toBeDefined();
    const coupangLink = getPurchaseLinks(nonAffiliateDirectPart!).find(
      (link) => link.channel === "coupang",
    );

    expect(coupangLink?.isAffiliate).toBe(false);
    expect(coupangLink?.url).toContain("/vp/products/8941845170");
    expect(nonAffiliateDirectPart?.affiliate.restrictionNote).toBe(
      "쿠팡 파트너스 링크 생성 제한 상품",
    );
  });

  it("157개 모두 공식 사이트를 제공하고 확인된 상품만 쿠팡 경로를 제공한다", () => {
    expect(consumables).toHaveLength(157);
    expect(
      consumables.every(
        (part) =>
          part.purchaseLinks[0]?.channel === "official" &&
          (part.affiliate.status === "unavailable"
            ? part.purchaseLinks.every((link) => link.channel !== "coupang")
            : part.purchaseLinks[1]?.channel === "coupang") &&
          part.purchaseLinks.every(
            (link) =>
              new URL(link.url).protocol === "https:" && !Number.isNaN(Date.parse(link.checkedAt)),
          ),
      ),
    ).toBe(true);
  });

  it("직접 상품 9개, 일반 검색 123개, 미확인 25개를 구분한다", () => {
    const coupangLinks = consumables.flatMap((part) =>
      part.purchaseLinks.filter((link) => link.channel === "coupang"),
    );

    expect(coupangLinks.filter((link) => link.linkType === "direct-product")).toHaveLength(9);
    expect(coupangLinks.filter((link) => link.linkType === "search-results")).toHaveLength(123);
    expect(coupangLinks.filter((link) => link.isAffiliate)).toHaveLength(4);
    expect(consumables.filter((part) => part.affiliate.status === "unavailable")).toHaveLength(25);
  });
});
