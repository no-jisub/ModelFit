import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import { createAutocompleteIndex, searchAutocomplete } from "../src/utils/autocomplete";
import { searchCatalog } from "../src/utils/searchCatalog";

const index = createAutocompleteIndex(models, consumables);

describe("autocomplete index", () => {
  it("전체 도메인 객체 대신 검색에 필요한 경량 필드만 노출한다", () => {
    const serialized = JSON.stringify(index);

    expect(index.models).toHaveLength(models.length);
    expect(index.consumables).toHaveLength(consumables.length);
    expect(serialized).not.toContain("purchaseLinks");
    expect(serialized).not.toContain("purchaseWarning");
    expect(serialized).not.toContain("sources");
  });

  it.each(["AS355NSNA", "ADQ30041405", "먼지봉투", "로보락 S8"])(
    "기존 통합 검색과 %s의 최상위 결과가 같다",
    (query) => {
      const expected = searchCatalog(models, consumables, query, {
        modelLimit: 4,
        consumableLimit: 4,
        compatibleModelLimit: 0,
      });
      const expectedTop = [
        ...expected.models.map(({ model, score }) => ({ id: model.id, score })),
        ...expected.consumables.map(({ part, score }) => ({ id: part.id, score })),
      ].sort((a, b) => b.score - a.score)[0];
      const actualTop = searchAutocomplete(index, query)[0];

      expect({ id: actualTop?.entityId, score: actualTop?.score }).toEqual(expectedTop);
    },
  );
});
