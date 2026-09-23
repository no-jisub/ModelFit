export type CatalogDataSource = "csv" | "sql-connect";

export interface CatalogCategoryRecord {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  modelNumberGuide?: string | null;
}

export interface CatalogBrandRecord {
  id: string;
  slug: string;
  name: string;
  nameEn?: string | null;
}

export interface CatalogModelRecord {
  id: string;
  slug: string;
  modelName: string;
  modelCode: string;
  series?: string | null;
  categoryId: string;
  brandId: string;
  releaseDate?: string | null;
  status?: string | null;
}

export interface CatalogListOptions {
  limit?: number;
  offset?: number;
}

export interface CatalogRepository {
  listCategories(): Promise<CatalogCategoryRecord[]>;
  listBrands(): Promise<CatalogBrandRecord[]>;
  listModelsByCategory(
    categoryId: string,
    options?: CatalogListOptions,
  ): Promise<CatalogModelRecord[]>;
  listModelsByBrand(brandId: string, options?: CatalogListOptions): Promise<CatalogModelRecord[]>;
  getModelBySlug(slug: string): Promise<CatalogModelRecord | null>;
  searchModels(query: string, limit?: number): Promise<CatalogModelRecord[]>;
}
