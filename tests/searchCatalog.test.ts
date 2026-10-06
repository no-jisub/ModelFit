import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import {
  searchCatalog,
  searchConsumables,
  splitStrongMatches,
  preferredSearchTab,
} from "../src/utils/searchCatalog";
import { createSearchCatalogData } from "../src/utils/searchData";

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
    expect(splitStrongMatches(result).primary.every(({ part }) => part.type === "dust-bag")).toBe(
      true,
    );
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

  it("강한 일치와 브랜드명만 일치하는 관련 결과를 분리한다", () => {
    const result = searchCatalog(models, consumables, "로보락 S8");
    const modelMatches = splitStrongMatches(result.models);
    const partMatches = splitStrongMatches(result.consumables);

    expect(modelMatches.primary.map(({ model }) => model.id)).toEqual(["roborock-s8-maxv-ultra"]);
    expect(partMatches.primary.map(({ part }) => part.id)).toEqual([
      "roborock-s8-qrevo-curv-compatible-dust-bag",
    ]);
    expect(modelMatches.related.length).toBeGreaterThan(0);
    expect(partMatches.related.length).toBeGreaterThan(0);
  });
});

it.each([
  ["로보락", "models"],
  ["로보락 S8", "models"],
  ["로보락 먼지봉투", "parts"],
  ["AS355NSNA", "models"],
  ["ADQ30041405", "parts"],
  ["필터", "parts"],
  ["먼지봉투", "parts"],
])("%s 검색은 %s 탭을 먼저 제공한다", (query, tab) => {
  expect(preferredSearchTab(query, models, searchCatalog(models, consumables, query))).toBe(tab);
});

it("반환 개수 제한이 전체 개수와 연결 모델을 바꾸지 않는다", () => {
  const all = searchCatalog(models, consumables, "필터");
  const page = searchCatalog(models, consumables, "필터", {
    consumableLimit: 12,
    compatibleModelLimit: 3,
  });
  expect(all.consumables.length).toBeGreaterThan(30);
  expect(page.consumables).toHaveLength(12);
  expect(page.totals).toEqual(all.totals);
  expect(page.totals.compatibleModels).toBeGreaterThan(3);
});

it("두 번째 판매 옵션에만 있는 상품명도 경량 검색에 포함한다", () => {
  const part = structuredClone(consumables[0]);
  part.productOptions.push({
    ...part.productOptions[0],
    id: "search-test-option",
    name: "고유검증상품XYZ",
    packageLabel: undefined,
  });
  const compact = createSearchCatalogData(models, [part]);
  expect(
    searchCatalog(compact.models, compact.consumables, "고유검증상품XYZ").consumables[0]?.part.id,
  ).toBe(part.id);
});
