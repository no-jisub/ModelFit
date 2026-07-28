import type { ApplianceCategory, ApplianceModel } from "@/types";
import { normalizeSearch } from "./normalizeSearch";

export interface SearchOptions {
  category?: ApplianceCategory | "all";
  brandId?: string | "all";
  limit?: number;
}

export interface RankedModel {
  model: ApplianceModel;
  score: number;
}

function searchableValues(model: ApplianceModel): string[] {
  return [
    model.modelCode,
    model.modelName,
    ...model.aliases,
    model.brandName,
    model.brandNameEn ?? "",
    model.series ?? "",
    `${model.brandName}${model.modelCode}`,
    `${model.brandNameEn ?? ""}${model.modelCode}`,
  ]
    .filter(Boolean)
    .map(normalizeSearch);
}

function scoreModel(model: ApplianceModel, query: string): number {
  const q = normalizeSearch(query);
  if (!q) return 1;

  const code = normalizeSearch(model.modelCode);
  const name = normalizeSearch(model.modelName);
  const aliases = model.aliases.map(normalizeSearch);
  const brandKo = normalizeSearch(model.brandName);
  const brandEn = normalizeSearch(model.brandNameEn ?? "");
  const values = searchableValues(model);

  if (code === q) return 100;
  if (name === q) return 90;
  if (aliases.includes(q)) return 80;
  if (code.includes(q)) return 70;
  if (name.includes(q)) return 60;
  if ((q.includes(brandKo) || q.includes(brandEn)) && values.some((value) => value.includes(q))) {
    return 50;
  }
  if (values.some((value) => value.includes(q) || q.includes(value))) return 30;

  const tokens = query
    .toLocaleLowerCase("ko-KR")
    .split(/[\s\-_]+/)
    .filter(Boolean);
  const haystack = values.join(" ");
  const matched = tokens.filter((token) => haystack.includes(normalizeSearch(token))).length;
  return matched > 0 ? 10 + matched : 0;
}

export function searchModels(
  allModels: ApplianceModel[],
  query: string,
  options: SearchOptions = {},
): RankedModel[] {
  const { category = "all", brandId = "all", limit } = options;

  const ranked = allModels
    .filter((model) => category === "all" || model.category === category)
    .filter((model) => brandId === "all" || model.brandId === brandId)
    .map((model) => ({ model, score: scoreModel(model, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.model.modelCode.localeCompare(b.model.modelCode));

  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}
