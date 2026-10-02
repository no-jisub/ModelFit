import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { consumables } from "../src/data/consumables";
import { createSearchCatalogData, hasOfficialCompatibility } from "../src/utils/searchData";
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

it("does not label inherited or unverified relations as officially compatible", () => {
  const part = structuredClone(consumables[0]);
  const relation = part.compatibilities[0];
  relation.verificationStatus = "official";
  relation.evidenceScope = "legacy-unscoped";
  let compact = createSearchCatalogData([], [part]).consumables[0];
  expect(hasOfficialCompatibility(compact, relation.modelId)).toBe(false);
  relation.evidenceScope = "scoped";
  compact = createSearchCatalogData([], [part]).consumables[0];
  expect(hasOfficialCompatibility(compact, relation.modelId)).toBe(true);
  expect(hasOfficialCompatibility(compact, "unknown-model")).toBe(false);
  relation.verificationStatus = "unverified";
  compact = createSearchCatalogData([], [part]).consumables[0];
  expect(hasOfficialCompatibility(compact, relation.modelId)).toBe(false);
});
