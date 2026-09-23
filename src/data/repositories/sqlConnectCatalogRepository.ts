import {
  connectorConfig,
  getModelBySlug,
  listBrands,
  listCategories,
  listModelsByBrand,
  listModelsByCategory,
  searchModels,
} from "@modelfit/dataconnect";
import {
  connectDataConnectEmulator,
  getDataConnect,
  type DataConnect,
} from "firebase/data-connect";
import { getFirebaseApp } from "../../lib/firebase/client";
import type { CatalogModelRecord, CatalogRepository } from "./types";

type SqlModel = {
  id: string;
  slug: string;
  modelName: string;
  modelCode: string;
  series?: string | null;
  status?: string | null;
  releaseYear?: number | null;
  releaseMonth?: number | null;
  releaseDay?: number | null;
  category?: { id: string };
  brand?: { id: string };
};

let dataConnect: DataConnect | undefined;
let emulatorConnected = false;

function releaseDate(model: SqlModel): string | null {
  if (!model.releaseYear) return null;
  const year = String(model.releaseYear);
  if (!model.releaseMonth) return year;
  const month = String(model.releaseMonth).padStart(2, "0");
  if (!model.releaseDay) return `${year}-${month}`;
  return `${year}-${month}-${String(model.releaseDay).padStart(2, "0")}`;
}

function normalizeModel(model: SqlModel): CatalogModelRecord {
  return {
    id: model.id,
    slug: model.slug,
    modelName: model.modelName,
    modelCode: model.modelCode,
    series: model.series ?? null,
    categoryId: model.category?.id ?? "",
    brandId: model.brand?.id ?? "",
    releaseDate: releaseDate(model),
    status: model.status ?? null,
  };
}

function client(): DataConnect {
  if (!dataConnect) {
    dataConnect = getDataConnect(getFirebaseApp(), connectorConfig);
  }

  const emulatorHost = import.meta.env.PUBLIC_DATA_CONNECT_EMULATOR_HOST?.trim();
  if (emulatorHost && !emulatorConnected) {
    const [host, portText] = emulatorHost.replace(/^https?:\/\//, "").split(":");
    connectDataConnectEmulator(dataConnect, host, Number(portText || 9399));
    emulatorConnected = true;
  }

  return dataConnect;
}

function variables(limit = 100, offset = 0) {
  return {
    limit: Math.max(0, limit),
    offset: Math.max(0, offset),
  };
}

export const sqlConnectCatalogRepository: CatalogRepository = {
  async listCategories() {
    const result = await listCategories(client());
    return result.data.categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      label: category.label,
      description: category.description ?? null,
      modelNumberGuide: category.modelNumberGuide ?? null,
    }));
  },
  async listBrands() {
    const result = await listBrands(client());
    return result.data.brands.map((brand) => ({
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      nameEn: brand.nameEn ?? null,
    }));
  },
  async listModelsByCategory(categoryId, options = {}) {
    const result = await listModelsByCategory(client(), {
      categoryId,
      ...variables(options.limit, options.offset),
    });
    return result.data.models.map(normalizeModel);
  },
  async listModelsByBrand(brandId, options = {}) {
    const result = await listModelsByBrand(client(), {
      brandId,
      ...variables(options.limit, options.offset),
    });
    return result.data.models.map(normalizeModel);
  },
  async getModelBySlug(slug) {
    const result = await getModelBySlug(client(), { slug });
    return result.data.model ? normalizeModel(result.data.model) : null;
  },
  async searchModels(query, limit = 20) {
    const result = await searchModels(client(), {
      query: query.trim(),
      limit: Math.max(0, limit),
    });
    return result.data.models_search.map(normalizeModel);
  },
};
