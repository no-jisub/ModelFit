import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { getPurchaseLinks } from "../src/utils/purchaseLinks";

describe("getPurchaseLinks", () => {
  const directPart = consumables.find((part) => part.affiliate.status === "direct-product");
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
    expect(directPart).toBeDefined();
    const coupangLink = getPurchaseLinks(
      directPart!,
      "https://link.coupang.com/re/AFFSDP?lptag=test",
    ).find((link) => link.channel === "coupang");

    expect(coupangLink?.linkType).toBe("direct-product");
    expect(coupangLink?.isAffiliate).toBe(false);
    expect(coupangLink?.url).toBe(directPart?.affiliate.directUrl);
  });
});
