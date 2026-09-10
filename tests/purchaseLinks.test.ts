import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { getPurchaseLinks } from "../src/utils/purchaseLinks";

describe("getPurchaseLinks", () => {
  it("LG M 필터 구매 선택지에 지정한 파트너스 링크를 연결한다", () => {
    const part = consumables.find((item) => item.id === "lg-puricare-m-filter");
    expect(part).toBeDefined();
    const expectedLink = {
      channel: "coupang",
      url: "https://link.coupang.com/a/gDwSqU3CAC",
      isAffiliate: true,
      linkType: "direct-product",
    };
    expect(getPurchaseLinks(part!)).toContainEqual(expect.objectContaining(expectedLink));
    expect(part!.productOptions[0]?.purchaseLinks).toContainEqual(
      expect.objectContaining(expectedLink),
    );
  });

  const affiliateDirectPart = consumables.find(
    (part) => part.affiliate.status === "direct-product" && part.affiliate.isAffiliate,
  );
  const nonAffiliateDirectPart = consumables.find(
    (part) => part.affiliate.status === "direct-product" && !part.affiliate.isAffiliate,
  );
  const unavailablePart = consumables.find((part) => part.affiliate.status === "unavailable");

  it("공식 사이트를 쿠팡보다 먼저 배치한다", () => {
    expect(affiliateDirectPart).toBeDefined();
    const links = getPurchaseLinks(affiliateDirectPart!);

    expect(links[0]?.channel).toBe("official");
    expect(links[1]?.channel).toBe("coupang");
  });

  it("상품 링크가 없으면 검색 결과를 자동 생성하지 않는다", () => {
    expect(unavailablePart).toBeDefined();
    const links = getPurchaseLinks(unavailablePart!, "https://www.coupang.com/np/search");
    expect(links.some((link) => link.channel === "coupang")).toBe(false);
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

  it("171개 모두 공식 사이트를 제공하고 확인된 상품만 쿠팡 경로를 제공한다", () => {
    expect(consumables).toHaveLength(171);
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

  it("직접 상품 9개만 연결하고 나머지 162개는 공식 근거를 제공한다", () => {
    const coupangLinks = consumables.flatMap((part) =>
      part.purchaseLinks.filter((link) => link.channel === "coupang"),
    );

    expect(coupangLinks.filter((link) => link.linkType === "direct-product")).toHaveLength(9);
    expect(coupangLinks.filter((link) => link.linkType === "search-results")).toHaveLength(0);
    expect(coupangLinks.filter((link) => link.isAffiliate)).toHaveLength(4);
    expect(consumables.filter((part) => part.affiliate.status === "unavailable")).toHaveLength(162);
  });
});
