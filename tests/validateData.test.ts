import { describe, expect, it } from "vitest";
import { brands } from "../src/data/brands";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import {
  getPartNumberStatus,
  getVerificationLabel,
  partNumberStatusLabels,
  statusLabels,
} from "../src/utils/labels";
import { validateData } from "../src/utils/validateData";

describe("data validation", () => {
  it("샘플 데이터의 참조 무결성을 만족한다", () => {
    expect(validateData(brands, models, consumables).errors).toEqual([]);
  });

  it("브랜드가 공식 출처 허용 도메인을 직접 소유한다", () => {
    expect(brands.every((brand) => brand.officialDomains.length > 0)).toBe(true);
    expect(brands.find((brand) => brand.id === "lg")?.officialDomains).toEqual(["lge.co.kr"]);
  });

  it("모든 검증 상태 표시를 제공한다", () => {
    expect(statusLabels.official).toBe("공식 출처 확인");
    expect(getVerificationLabel("official", "model")).toBe("공식 모델 확인");
    expect(getVerificationLabel("official", "compatibility")).toBe("공식 호환 확인");
    expect(statusLabels.unverified).toBe("미검증");
  });

  it("부품번호 유무를 검증 상태와 별도로 표시한다", () => {
    expect(getPartNumberStatus("ADQ30041405")).toBe("confirmed");
    expect(getPartNumberStatus()).toBe("researching");
    expect(getPartNumberStatus(undefined, "not-listed")).toBe("not-listed");
    expect(partNumberStatusLabels["not-listed"]).toBe("공식 자료에 번호 미표기");
    expect(consumables.every((part) => Boolean(part.partNumberStatus))).toBe(true);
  });

  it("활성화된 구매 링크는 HTTPS 쿠팡 주소만 사용한다", () => {
    const links = consumables
      .flatMap((part) => part.productOptions.flatMap((option) => option.purchaseLinks))
      .filter((link) => link.channel === "coupang");

    expect(links.length).toBeGreaterThan(0);
    expect(
      links.every((link) => {
        const url = new URL(link.url);
        return url.protocol === "https:" && url.hostname.endsWith("coupang.com");
      }),
    ).toBe(true);
  });

  it("쿠팡 링크 상태가 URL 유형과 일치한다", () => {
    expect(
      consumables
        .flatMap((part) => part.productOptions.flatMap((option) => option.purchaseLinks))
        .filter((link) => link.channel === "coupang")
        .every(
          (link) =>
            link.linkType === "direct-product" &&
            (link.url.includes("/vp/products/") ||
              link.url.startsWith("https://link.coupang.com/a/")),
        ),
    ).toBe(true);
  });

  it("제휴 링크는 쿠팡 파트너스 단축 URL로만 표시한다", () => {
    const affiliateLinks = consumables
      .flatMap((part) => part.productOptions.flatMap((option) => option.purchaseLinks))
      .filter((link) => link.isAffiliate);

    expect(affiliateLinks.length).toBeGreaterThan(0);
    expect(affiliateLinks.every((link) => link.url.startsWith("https://link.coupang.com/a/"))).toBe(
      true,
    );
  });

  it("모든 구매 링크는 확인일을 제공한다", () => {
    expect(
      consumables
        .flatMap((part) => part.productOptions.flatMap((option) => option.purchaseLinks))
        .every((link) => !Number.isNaN(Date.parse(link.checkedAt))),
    ).toBe(true);
  });

  it("공개 카탈로그에는 교체 소모품이 연결된 모델만 등록한다", () => {
    expect(models).toHaveLength(90);
    expect(models.every((model) => model.consumableIds.length > 0)).toBe(true);
    expect(models.filter((model) => model.category === "air-purifier")).toHaveLength(50);
    expect(models.filter((model) => model.category === "robot-vacuum")).toHaveLength(40);
    expect(brands.every((brand) => models.some((model) => model.brandId === brand.id))).toBe(true);
  });

  it("정기 교체 필터가 없는 삼성 리유저블 모델은 제외한다", () => {
    const excludedCodes = [
      "AP90H10198EDD",
      "AP90H10198UDD",
      "AP90H03193EGD",
      "AP90H03193UGD",
      "AP90H10198MDD",
    ];
    expect(models.some((model) => excludedCodes.includes(model.modelCode))).toBe(false);
    expect(brands.some((brand) => brand.id === "samsung")).toBe(false);
  });

  it("모든 소모품이 제조사 공식 출처와 확인일을 제공한다", () => {
    expect(
      consumables.every(
        (part) =>
          part.sources.length > 0 &&
          part.sources.every(
            (source) =>
              source.url.startsWith("https://") && !Number.isNaN(Date.parse(source.checkedAt)),
          ) &&
          part.sources.some((source) =>
            ["manufacturer", "official-manual", "official-store"].includes(source.sourceType),
          ),
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
            (source) => source.url.startsWith("https://") && source.checkedAt >= "2026-08-04",
          ),
      ),
    ).toBe(true);
  });
});
