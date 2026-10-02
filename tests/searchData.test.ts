import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { consumables } from "../src/data/consumables";
import { createSearchCatalogData } from "../src/utils/searchData";
import { searchCatalog } from "../src/utils/searchCatalog";
describe("search page payload", () => {
  it("omits sources and purchase data while preserving model and part search results", () => {
    const compact = createSearchCatalogData(models, consumables);
    const encoded = JSON.stringify(compact);
    expect(encoded).not.toContain("purchaseLinks");
    expect(encoded).not.toContain("sourceUrl");
    expect(encoded.length).toBeLessThan(JSON.stringify({ models, consumables }).length / 3);
    for (const q of ["AS355NSNA", "ADQ30041405", "로보락 S8", "먼지봉투"]) {
      const fullResults = searchCatalog(models, consumables, q);
      const slimResults = searchCatalog(compact.models, compact.consumables, q);
      expect(slimResults.models.map((x) => [x.model.id, x.score])).toEqual(
        fullResults.models.map((x) => [x.model.id, x.score]),
      );
      expect(slimResults.consumables.map((x) => [x.part.id, x.score])).toEqual(
        fullResults.consumables.map((x) => [x.part.id, x.score]),
      );
      expect(slimResults.compatibleModels.map((x) => x.model.id)).toEqual(
        fullResults.compatibleModels.map((x) => x.model.id),
      );
    }
  });
});
