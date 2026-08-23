import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";

describe("consumable product options", () => {
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
