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

  it("2차 검증 소모품은 둘 이상의 공식 근거와 최신 확인일을 제공한다", () => {
    const secondPassIds = [
      "irobot-clean-base-autowash-dust-bag",
      "irobot-combo-i-e-j-dual-rubber-brushes",
      "irobot-combo-i-e-j-edge-brush",
      "irobot-combo-j9-washable-mop-pad",
      "irobot-combo-i5-mopping-kit",
      "roborock-saros-z70-main-brush",
      "roborock-saros-z70-side-brush",
      "roborock-saros-z70-filter",
      "roborock-saros-z70-mop-cloth",
      "eufy-x10-pro-main-brush",
      "eufy-x10-pro-filter",
      "eufy-x10-pro-mop-cloth",
      "eufy-x10-pro-dust-bag",
      "eufy-c28-side-brush",
      "eufy-c28-main-brush",
      "eufy-c28-roller-mop",
      "xiaomi-5-series-anti-tangle-side-brush",
    ];

    const secondPassParts = secondPassIds.map((id) => consumables.find((part) => part.id === id));

    expect(secondPassParts.every(Boolean)).toBe(true);
    expect(
      secondPassParts.every(
        (part) =>
          part?.verificationStatus === "official" &&
          part.sources.length >= 2 &&
          part.sources.every(
            (source) => source.url.startsWith("https://") && source.checkedAt === "2026-08-04",
          ),
      ),
    ).toBe(true);
  });
});
