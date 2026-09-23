import { staticCatalogRepository } from "./repositories/staticCatalogRepository";
import type { CatalogDataSource, CatalogRepository } from "./repositories/types";

export type {
  CatalogBrandRecord,
  CatalogCategoryRecord,
  CatalogDataSource,
  CatalogListOptions,
  CatalogModelRecord,
  CatalogRepository,
} from "./repositories/types";

export function resolveCatalogDataSource(
  value: string | undefined = import.meta.env.PUBLIC_CATALOG_DATA_SOURCE,
): CatalogDataSource {
  return value === "sql-connect" ? "sql-connect" : "csv";
}

export async function createCatalogRepository(
  source = resolveCatalogDataSource(),
): Promise<CatalogRepository> {
  if (source === "sql-connect") {
    const { sqlConnectCatalogRepository } =
      await import("./repositories/sqlConnectCatalogRepository");
    return sqlConnectCatalogRepository;
  }

  return staticCatalogRepository;
}

export const catalogRepository = staticCatalogRepository;
