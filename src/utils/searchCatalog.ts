import type { ApplianceCategory, ApplianceModel, ConsumableCompatibility } from "@/types";
import { partTypeLabels } from "./labels";
import { normalizeSearch } from "./normalizeSearch";
import { type RankedModel, searchModels } from "./searchModels";

export type ConsumableMatchReason =
  "part-number" | "product-name" | "display-name" | "keyword" | "type";

export interface RankedConsumable {
  part: ConsumableCompatibility;
  score: number;
  reason: ConsumableMatchReason;
}

export interface CompatibleModelMatch {
  model: ApplianceModel;
  matchedParts: ConsumableCompatibility[];
  score: number;
}

export interface CatalogSearchOptions {
  category?: ApplianceCategory | "all";
  brandId?: string | "all";
  modelLimit?: number;
  consumableLimit?: number;
  compatibleModelLimit?: number;
}

export interface CatalogSearchResult {
  models: RankedModel[];
  consumables: RankedConsumable[];
  compatibleModels: CompatibleModelMatch[];
}

function getConsumableValues(part: ConsumableCompatibility) {
  return {
    partNumber: normalizeSearch(part.genuinePartNumber ?? ""),
    productName: normalizeSearch(part.compatibleProductName ?? ""),
    displayName: normalizeSearch(part.displayName),
    keywords: part.searchKeywords.map(normalizeSearch),
    type: normalizeSearch(partTypeLabels[part.type]),
  };
}

function scoreConsumable(
  part: ConsumableCompatibility,
  query: string,
): Pick<RankedConsumable, "score" | "reason"> {
  const q = normalizeSearch(query);
  const values = getConsumableValues(part);

  if (!q) return { score: 0, reason: "keyword" };
  if (values.partNumber && values.partNumber === q) return { score: 120, reason: "part-number" };
  if (values.productName && values.productName === q) return { score: 110, reason: "product-name" };
  if (values.displayName === q) return { score: 100, reason: "display-name" };
  if (values.keywords.includes(q)) return { score: 95, reason: "keyword" };
  if (values.partNumber && values.partNumber.includes(q)) {
    return { score: 90, reason: "part-number" };
  }
  if (values.productName && values.productName.includes(q)) {
    return { score: 85, reason: "product-name" };
  }
  if (values.displayName.includes(q) || q.includes(values.displayName)) {
    return { score: 80, reason: "display-name" };
  }
  if (values.keywords.some((value) => value.includes(q) || q.includes(value))) {
    return { score: 70, reason: "keyword" };
  }
  if (values.type.includes(q) || q.includes(values.type)) return { score: 60, reason: "type" };

  const tokens = query
    .toLocaleLowerCase("ko-KR")
    .split(/[\s\-_]+/)
    .map(normalizeSearch)
    .filter(Boolean);
  const haystack = [
    values.partNumber,
    values.productName,
    values.displayName,
    ...values.keywords,
    values.type,
  ].join(" ");
  const matched = tokens.filter((token) => haystack.includes(token)).length;

  return matched > 0
    ? { score: 20 + matched * 5, reason: "keyword" }
    : { score: 0, reason: "keyword" };
}

export function searchConsumables(
  allConsumables: ConsumableCompatibility[],
  allModels: ApplianceModel[],
  query: string,
  options: Pick<CatalogSearchOptions, "category" | "brandId" | "consumableLimit"> = {},
): RankedConsumable[] {
  const { category = "all", brandId = "all", consumableLimit } = options;
  if (!normalizeSearch(query)) return [];

  const eligibleModelIds = new Set(
    allModels
      .filter((model) => category === "all" || model.category === category)
      .filter((model) => brandId === "all" || model.brandId === brandId)
      .map((model) => model.id),
  );

  const results = allConsumables
    .filter((part) => part.compatibleModelIds.some((id) => eligibleModelIds.has(id)))
    .map((part) => ({ part, ...scoreConsumable(part, query) }))
    .filter((result) => result.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.part.displayName.localeCompare(b.part.displayName, "ko"),
    );

  return typeof consumableLimit === "number" ? results.slice(0, consumableLimit) : results;
}

export function searchCatalog(
  allModels: ApplianceModel[],
  allConsumables: ConsumableCompatibility[],
  query: string,
  options: CatalogSearchOptions = {},
): CatalogSearchResult {
  const {
    category = "all",
    brandId = "all",
    modelLimit,
    consumableLimit,
    compatibleModelLimit = 12,
  } = options;
  const models = searchModels(allModels, query, { category, brandId, limit: modelLimit });
  const consumables = searchConsumables(allConsumables, allModels, query, {
    category,
    brandId,
    consumableLimit,
  });
  const directModelIds = new Set(models.map(({ model }) => model.id));
  const compatibleModels = allModels
    .filter((model) => category === "all" || model.category === category)
    .filter((model) => brandId === "all" || model.brandId === brandId)
    .filter((model) => !directModelIds.has(model.id))
    .map((model) => {
      const matchedParts = consumables
        .filter(({ part }) => part.compatibleModelIds.includes(model.id))
        .map(({ part }) => part);
      const score = Math.max(
        0,
        ...consumables
          .filter(({ part }) => part.compatibleModelIds.includes(model.id))
          .map(({ score }) => score),
      );
      return { model, matchedParts, score };
    })
    .filter(({ matchedParts }) => matchedParts.length > 0)
    .sort((a, b) => b.score - a.score || a.model.modelCode.localeCompare(b.model.modelCode))
    .slice(0, compatibleModelLimit);

  return { models, consumables, compatibleModels };
}
