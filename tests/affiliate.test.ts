import { describe, expect, it } from "vitest";
import { buildAffiliateUrl } from "../src/utils/affiliate";

describe("buildAffiliateUrl", () => {
  it("검색어를 안전하게 URL에 추가한다", () => {
    expect(buildAffiliateUrl("https://www.coupang.com/np/search", "S8 필터")).toContain(
      "q=S8+%ED%95%84%ED%84%B0",
    );
  });

  it("기본 쿠팡 검색 링크를 제공한다", () => {
    expect(buildAffiliateUrl("", "S8 필터")).toBe(
      "https://www.coupang.com/np/search?q=S8+%ED%95%84%ED%84%B0",
    );
  });

  it("쿠팡 외부 URL과 비HTTPS URL은 차단한다", () => {
    expect(buildAffiliateUrl("javascript:alert(1)", "필터")).toBeNull();
    expect(buildAffiliateUrl("https://example.com/search", "필터")).toBeNull();
    expect(buildAffiliateUrl("http://www.coupang.com/np/search", "필터")).toBeNull();
  });
});
