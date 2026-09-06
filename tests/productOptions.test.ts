import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { createProductOptions } from "../src/utils/productOptions";
import { models } from "../src/data/models";

describe("consumable product options", () => {
  it("공식 근거가 없는 데이터에 공식 확인 설명을 자동으로 붙이지 않는다", () => {
    const option = createProductOptions(
      { ...consumables[0], verificationStatus: "unverified" },
      [],
    )[0];
    expect(option.verification).toBe("unverified");
    expect(option.description).toContain("추가 확인이 필요");
    expect(option.description).not.toContain("공식 자료에서 확인한");
  });
  it("LG 360 공기청정기는 모델별 필터 필요 수량과 관리 방식을 구분한다", () => {
    const mFilter = consumables.find((part) => part.id === "lg-puricare-m-filter")!;
    const gFilter = consumables.find((part) => part.id === "lg-puricare-g-filter")!;
    const preFilter = consumables.find((part) => part.id === "lg-360-micro-filter")!;

    expect(mFilter.compatibleProductName).toContain("1회 교체 시 2개 필요");
    expect(gFilter.compatibleProductName).toContain("AS355NSAH는 2개");
    expect(gFilter.compatibleProductName).toContain("AS205NSJA/NGJA는 1개");
    expect(mFilter.replacementInterval).toMatch(/^약 1년/);
    expect(gFilter.purchaseWarning).toContain("물로 세척하지 마세요");
    expect(preFilter.compatibleProductName).toContain("6개입");
    expect(preFilter.purchaseWarning).toContain("한 달마다");
  });
  it("웰스는 주기가 다른 교체 필터를 구분하고 미확인 부품번호를 추정하지 않는다", () => {
    const al106 = models.find((model) => model.id === "wells-al106")!;
    const aq107 = models.find((model) => model.id === "wells-aq107")!;
    const tornado = models.find((model) => model.id === "wells-an730")!;
    expect(al106.consumableIds).toHaveLength(3);
    expect(aq107.consumableIds).toHaveLength(4);
    expect(tornado.consumableIds).toHaveLength(3);
    const parts = consumables.filter((part) => al106.consumableIds.includes(part.id));
    expect(parts.find((part) => part.type === "custom-filter")?.replacementInterval).toMatch(
      /^3개월/,
    );
    expect(
      parts
        .filter((part) => part.type !== "custom-filter")
        .every((part) => part.replacementInterval?.startsWith("12개월")),
    ).toBe(true);
    expect(parts.every((part) => !part.genuinePartNumber && !part.affiliate.enabled)).toBe(true);
  });
  it("제로 S는 교체 필터 두 종류를 별도 부품번호와 공식 구매 근거로 제공한다", () => {
    const model = models.find((item) => item.id === "winix-azse430-jwk")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(parts.map((part) => part.genuinePartNumber)).toEqual(["CAF-I0H3", "CAF-I0D1"]);
    expect(parts.map((part) => part.type)).toEqual(["dust-filter", "deodorizing-filter"]);
    expect(
      parts.every((part) => part.sources.some((source) => source.sourceType === "official-manual")),
    ).toBe(true);
    expect(parts.every((part) => part.purchaseWarning?.includes("물세척하면 안 됩니다"))).toBe(
      true,
    );
    expect(parts.every((part) => !part.affiliate.enabled)).toBe(true);
  });
  it("AP-2219K는 탈취와 집진 기능이 결합된 복합필터 한 개로 안내한다", () => {
    const model = models.find((item) => item.id === "coway-ap-2219k")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(parts).toHaveLength(1);
    expect(parts[0].displayName).toBe("코웨이 AP-2219K 일체형 복합필터");
    expect(parts[0].compatibleProductName).toContain("탈취필터와 초미세먼지 집진필터가 결합");
    expect(parts[0].replacementInterval).toMatch(/^12개월/);
    expect(parts[0].sources.some((source) => source.sourceType === "official-manual")).toBe(true);
    expect(parts[0].genuinePartNumber).toBeUndefined();
    expect(parts[0].affiliate.enabled).toBe(false);
  });
  it("에브리봇 걸레는 부품명과 판매 수량을 분리한다", () => {
    const parts = consumables.filter(
      (part) => part.id.startsWith("everybot-") && part.type === "mop-pad",
    );
    const packagedParts = parts.filter((part) => part.compatibleProductName?.match(/[23]장/));

    expect(packagedParts).toHaveLength(4);
    expect(packagedParts.every((part) => !part.displayName.match(/[23]장/))).toBe(true);
  });

  it("SK매직 ACL20은 공식 일체형 필터 부품번호와 주기를 제공한다", () => {
    const model = models.find((item) => item.id === "skmagic-acl20c1askwh")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);

    expect(parts).toHaveLength(1);
    expect(parts[0].genuinePartNumber).toBe("FLTA20C2ATWH");
    expect(parts[0].displayName).toContain("일체형 필터");
    expect(parts[0].replacementInterval).toMatch(/^12개월/);
    expect(parts[0].sources[0].url).toContain("goodsId=G000066078");
  });
  it("모든 소모품에 최소 한 개의 정품 기준 상품을 제공한다", () => {
    expect(
      consumables.every(
        (part) =>
          part.productOptions.length > 0 &&
          part.productOptions.some(
            (option) => option.kind === "genuine" && option.verification === "official-genuine",
          ),
      ),
    ).toBe(true);
  });

  it("특정 상품 후보에 쿠팡 검색 결과 링크를 포함하지 않는다", () => {
    expect(
      consumables
        .flatMap((part) => part.productOptions)
        .flatMap((option) => option.purchaseLinks)
        .every((link) => link.linkType !== "search-results"),
    ).toBe(true);
  });

  it("다이슨 BP03을 활성탄소와 HEPA H13 두 소모품으로 분리한다", () => {
    const model = models.find((item) => item.id === "dyson-bp03");
    const parts = model?.consumableIds.map((id) => consumables.find((part) => part.id === id));

    expect(parts).toHaveLength(2);
    expect(parts?.map((part) => part?.displayName)).toEqual([
      "다이슨 BP03 활성 탄소 필터",
      "다이슨 빅+콰이엇 HEPA H13 필터",
    ]);
    expect(parts?.every((part) => part?.productOptions[0]?.kind === "genuine")).toBe(true);
  });

  it("검증된 직접 상품 링크는 해당 정품 후보 안에서 제공한다", () => {
    const part = consumables.find((item) => item.id === "winix-tower-edge-all-in-one-filter");
    const directLinks = part?.productOptions[0]?.purchaseLinks.filter(
      (link) => link.linkType === "direct-product",
    );

    expect(directLinks).toHaveLength(1);
    expect(directLinks?.[0]?.url).toContain("/vp/products/7368403017");
  });
});
