import { describe, expect, it } from "vitest";
import { buildAffiliateUrl } from "../src/utils/affiliate";

describe("buildAffiliateUrl", () => {
  it("검색어를 안전하게 URL에 추가한다", () => {
    expect(buildAffiliateUrl("https://example.com/search", "S8 필터")).toContain(
      "q=S8+%ED%95%84%ED%84%B0",
    );
  });

  it("잘못된 URL은 null로 처리한다", () => {
    expect(buildAffiliateUrl("javascript:alert(1)", "필터")).toBeNull();
    expect(buildAffiliateUrl("", "필터")).toBeNull();
  });
});
