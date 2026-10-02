import type { ApplianceModel, ConsumableCompatibility } from "@/types";

export type SearchModel = Pick<
  ApplianceModel,
  | "id"
  | "slug"
  | "category"
  | "brandId"
  | "brandName"
  | "brandNameEn"
  | "modelName"
  | "modelCode"
  | "aliases"
  | "series"
  | "consumableIds"
> & {
  image?: Pick<NonNullable<ApplianceModel["image"]>, "src" | "alt">;
};
export type SearchConsumable = Pick<
  ConsumableCompatibility,
  | "id"
  | "displayName"
  | "type"
  | "genuinePartNumber"
  | "partNumberStatus"
  | "compatibleModelIds"
  | "searchKeywords"
> & {
  productOptions: { name: string; packageLabel?: string }[];
};
export interface SearchCatalogData {
  models: SearchModel[];
  consumables: SearchConsumable[];
}

export function createSearchCatalogData(
  models: ApplianceModel[],
  consumables: ConsumableCompatibility[],
): SearchCatalogData {
  return {
    models: models.map(
      ({
        id,
        slug,
        category,
        brandId,
        brandName,
        brandNameEn,
        modelName,
        modelCode,
        aliases,
        series,
        consumableIds,
        image,
      }) => ({
        id,
        slug,
        category,
        brandId,
        brandName,
        brandNameEn,
        modelName,
        modelCode,
        aliases,
        series,
        consumableIds,
        image: image ? { src: image.src, alt: image.alt } : undefined,
      }),
    ),
    consumables: consumables.map(
      ({
        id,
        displayName,
        type,
        genuinePartNumber,
        partNumberStatus,
        compatibleModelIds,
        searchKeywords,
        productOptions,
      }) => ({
        id,
        displayName,
        type,
        genuinePartNumber,
        partNumberStatus,
        compatibleModelIds,
        searchKeywords,
        productOptions: productOptions
          .slice(0, 1)
          .map(({ name, packageLabel }) => ({ name, packageLabel })),
      }),
    ),
  };
}
