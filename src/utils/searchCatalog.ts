import type { ApplianceCategory } from "@/types";
import type { SearchModel, SearchConsumable } from "./searchData";
import { partTypeLabels } from "./labels";
import { normalizeSearch } from "./normalizeSearch";
import { type RankedModel, searchModels } from "./searchModels";

export type ConsumableMatchReason =
  "part-number" | "product-name" | "display-name" | "keyword" | "type";

export interface RankedConsumable {
  part: SearchConsumable;
  score: number;
  reason: ConsumableMatchReason;
}

export interface CompatibleModelMatch {
  model: SearchModel;
  matchedParts: SearchConsumable[];
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
  totals: { models: number; consumables: number; compatibleModels: number };
}

export function preferredSearchTab(
  query: string,
  allModels: SearchModel[],
  result: CatalogSearchResult,
): "models" | "parts" {
  const q = normalizeSearch(query);
  if (!q) return "models";
  const modelIntent = allModels.some((model) =>
    [model.brandName, model.brandNameEn, model.modelCode, model.modelName, ...model.aliases]
      .filter((value): value is string => Boolean(value))
      .some((value) => normalizeSearch(value) === q),
  );
  // 50+ identifies a model code/name/alias or brand + model prefix (e.g. 로보락 S8).
  if (modelIntent || (result.models[0]?.score ?? 0) >= 50) return "models";
  return result.consumables.length > 0 ? "parts" : "models";
}

export function splitStrongMatches<T extends { score: number }>(items: T[]) {
  const topScore = items[0]?.score ?? 0;
  if (topScore < 30) return { primary: items, related: [] as T[] };

  return {
    primary: items.filter(({ score }) => score === topScore),
    related: items.filter(({ score }) => score !== topScore),
  };
}

function getConsumableValues(part: SearchConsumable) {
  return {
    partNumber: normalizeSearch(part.genuinePartNumber ?? ""),
    productNames: part.productOptions
      .map((option) =>
        normalizeSearch([option.name, option.packageLabel].filter(Boolean).join(" ")),
      )
      .filter(Boolean),
    displayName: normalizeSearch(part.displayName),
    keywords: part.searchKeywords.map(normalizeSearch),
    type: normalizeSearch(partTypeLabels[part.type]),
  };
}

function scoreConsumable(
  part: SearchConsumable,
  query: string,
): Pick<RankedConsumable, "score" | "reason"> {
  const q = normalizeSearch(query);
  const values = getConsumableValues(part);

  if (!q) return { score: 0, reason: "keyword" };
  if (values.partNumber && values.partNumber === q) return { score: 120, reason: "part-number" };
  if (values.type === q) return { score: 115, reason: "type" };
  if (values.productNames.includes(q)) return { score: 110, reason: "product-name" };
  if (values.displayName === q) return { score: 100, reason: "display-name" };
  if (values.keywords.includes(q)) return { score: 95, reason: "keyword" };
  if (values.partNumber && values.partNumber.includes(q)) {
    return { score: 90, reason: "part-number" };
  }
  if (values.productNames.some((value) => value.includes(q))) {
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
    ...values.productNames,
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
  allConsumables: SearchConsumable[],
  allModels: SearchModel[],
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

  const ranked = allConsumables
    .filter((part) => part.compatibleModelIds.some((id) => eligibleModelIds.has(id)))
    .map((part) => ({ part, ...scoreConsumable(part, query) }))
    .filter((result) => result.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.part.displayName.localeCompare(b.part.displayName, "ko"),
    );

  return typeof consumableLimit === "number" ? ranked.slice(0, consumableLimit) : ranked;
}

export function searchCatalog(
  allModels: SearchModel[],
  allConsumables: SearchConsumable[],
  query: string,
  options: CatalogSearchOptions = {},
): CatalogSearchResult {
  const {
    category = "all",
    brandId = "all",
    modelLimit,
    consumableLimit,
    compatibleModelLimit,
  } = options;
  const models = searchModels(allModels, query, { category, brandId });
  const consumables = searchConsumables(allConsumables, allModels, query, {
    category,
    brandId,
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
    .sort((a, b) => b.score - a.score || a.model.modelCode.localeCompare(b.model.modelCode));

  return {
    models: typeof modelLimit === "number" ? models.slice(0, modelLimit) : models,
    consumables:
      typeof consumableLimit === "number" ? consumables.slice(0, consumableLimit) : consumables,
    compatibleModels:
      typeof compatibleModelLimit === "number"
        ? compatibleModels.slice(0, compatibleModelLimit)
        : compatibleModels,
    totals: {
      models: models.length,
      consumables: consumables.length,
      compatibleModels: compatibleModels.length,
    },
  };
}
