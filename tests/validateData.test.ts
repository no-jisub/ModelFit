import { describe, expect, it } from "vitest";
import { brands } from "../src/data/brands";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import { statusLabels } from "../src/utils/labels";
import { validateData } from "../src/utils/validateData";

describe("data validation", () => {
  it("샘플 데이터의 참조 무결성을 만족한다", () => {
    expect(validateData(brands, models, consumables).errors).toEqual([]);
  });

  it("모든 검증 상태 표시를 제공한다", () => {
    expect(statusLabels.official).toBe("공식 확인");
    expect(statusLabels.unverified).toBe("미검증");
  });

  it("활성화된 구매 링크는 HTTPS 쿠팡 주소만 사용한다", () => {
    const linkedParts = consumables.filter((part) => part.affiliate.enabled);

    expect(linkedParts.length).toBeGreaterThan(0);
    expect(
      linkedParts.every((part) => {
        const url = new URL(part.affiliate.directUrl ?? "");
        return url.protocol === "https:" && url.hostname.endsWith("coupang.com");
      }),
    ).toBe(true);
  });

  it("쿠팡 링크 상태가 URL 유형과 일치한다", () => {
    expect(
      consumables.every((part) => {
        const url = part.affiliate.directUrl ?? "";

        if (part.affiliate.status === "direct-product") return url.includes("/vp/products/");
        if (part.affiliate.status === "search-results") return url.includes("/np/search");
        return !part.affiliate.enabled;
      }),
    ).toBe(true);
  });

  it("모든 구매 링크는 가격·재고 수동 확인 상태와 확인일을 제공한다", () => {
    expect(
      consumables.every(
        (part) =>
          part.affiliate.priceStatus === "manual-check-required" &&
          part.affiliate.stockStatus === "manual-check-required" &&
          !Number.isNaN(Date.parse(part.affiliate.linkCheckedAt)),
      ),
    ).toBe(true);
  });

  it("모든 실제 모델은 공식 소모품 또는 비등록 사유를 제공한다", () => {
    expect(
      models.every(
        (model) =>
          model.isDemo || model.consumableIds.length > 0 || Boolean(model.consumableNote?.trim()),
      ),
    ).toBe(true);
  });
});
