import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import { searchCatalog, searchConsumables } from "../src/utils/searchCatalog";

describe("통합검색", () => {
  it("정품 부품번호 완전 일치를 가장 먼저 반환한다", () => {
    const result = searchCatalog(models, consumables, "ADQ30041405");

    expect(result.consumables[0]?.part.id).toBe("lg-puricare-m-filter");
    expect(result.consumables[0]?.reason).toBe("part-number");
    expect(result.models).toHaveLength(0);
  });

  it("상품명으로 소모품과 호환 모델을 함께 찾는다", () => {
    const result = searchCatalog(models, consumables, "PFSALC01");

    expect(result.consumables[0]?.part.id).toBe("lg-puricare-m-filter");
    expect(result.compatibleModels.map(({ model }) => model.id)).toEqual(
      expect.arrayContaining(["lg-as355nsna", "lg-as355ngna"]),
    );
  });

  it("소모품 종류 검색을 지원한다", () => {
    const result = searchConsumables(consumables, models, "먼지봉투");

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(({ part }) => part.type === "dust-bag")).toBe(true);
  });

  it("브랜드 필터가 소모품과 역검색 모델에 함께 적용된다", () => {
    const result = searchCatalog(models, consumables, "먼지봉투", { brandId: "roborock" });

    expect(
      result.consumables.every(({ part }) =>
        part.compatibleModelIds.some((id) => id.startsWith("roborock-")),
      ),
    ).toBe(true);
    expect(result.compatibleModels.every(({ model }) => model.brandId === "roborock")).toBe(true);
  });
});
