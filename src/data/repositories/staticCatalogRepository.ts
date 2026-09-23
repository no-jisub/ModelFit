import { brands } from "../brands";
import { categories } from "../categories";
import { models } from "../models";
import type { CatalogListOptions, CatalogRepository } from "./types";

function page<T>(rows: T[], options: CatalogListOptions = {}): T[] {
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(0, options.limit ?? rows.length);
  return rows.slice(offset, offset + limit);
}

const categoryRows = categories.map((category) => ({
  id: category.id,
  slug: category.id,
  label: category.label,
  description: category.description,
  modelNumberGuide: category.modelNumberGuide,
}));

const brandRows = brands.map((brand) => ({
  id: brand.id,
  slug: brand.slug,
  name: brand.name,
  nameEn: brand.nameEn ?? null,
}));

const modelRows = models.map((model) => ({
  id: model.id,
  slug: model.slug,
  modelName: model.modelName,
  modelCode: model.modelCode,
  series: model.series ?? null,
  categoryId: model.category,
  brandId: model.brandId,
  releaseDate: model.releaseDate ?? null,
  status: model.isDemo ? "draft" : "published",
}));

export const staticCatalogRepository: CatalogRepository = {
  async listCategories() {
    return categoryRows;
  },
  async listBrands() {
    return brandRows;
  },
  async listModelsByCategory(categoryId, options) {
    return page(
      modelRows.filter((model) => model.categoryId === categoryId),
      options,
    );
  },
  async listModelsByBrand(brandId, options) {
    return page(
      modelRows.filter((model) => model.brandId === brandId),
      options,
    );
  },
  async getModelBySlug(slug) {
    return modelRows.find((model) => model.slug === slug) ?? null;
  },
  async searchModels(query, limit = 20) {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
    if (!normalizedQuery) return [];

    return modelRows
      .filter((model) =>
        [model.modelName, model.modelCode, model.series]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase("ko-KR").includes(normalizedQuery)),
      )
      .slice(0, Math.max(0, limit));
  },
};
