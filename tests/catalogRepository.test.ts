import { describe, expect, it } from "vitest";
import { createCatalogRepository, resolveCatalogDataSource } from "../src/data/catalogRepository";
import { brands } from "../src/data/brands";
import { categories } from "../src/data/categories";
import { models } from "../src/data/models";

describe("catalog repository", () => {
  it("uses CSV unless SQL Connect is explicitly selected", () => {
    expect(resolveCatalogDataSource(undefined)).toBe("csv");
    expect(resolveCatalogDataSource("csv")).toBe("csv");
    expect(resolveCatalogDataSource("invalid")).toBe("csv");
    expect(resolveCatalogDataSource("sql-connect")).toBe("sql-connect");
  });

  it("reads the complete static catalog through one interface", async () => {
    const repository = await createCatalogRepository("csv");

    expect(await repository.listCategories()).toHaveLength(categories.length);
    expect(await repository.listBrands()).toHaveLength(brands.length);

    const category = categories[0];
    const expectedModels = models.filter((model) => model.category === category.id);
    const actualModels = await repository.listModelsByCategory(category.id);
    expect(actualModels).toHaveLength(expectedModels.length);
  });

  it("supports pagination, exact slug lookup, and search", async () => {
    const repository = await createCatalogRepository("csv");
    const firstModel = models[0];

    const page = await repository.listModelsByBrand(firstModel.brandId, {
      limit: 1,
      offset: 0,
    });
    expect(page).toHaveLength(1);
    expect((await repository.getModelBySlug(firstModel.slug))?.id).toBe(firstModel.id);
    expect(
      (await repository.searchModels(firstModel.modelCode, 5)).some(
        (model) => model.id === firstModel.id,
      ),
    ).toBe(true);
    expect(await repository.searchModels("   ")).toEqual([]);
  });
});
