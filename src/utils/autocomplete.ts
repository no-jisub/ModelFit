import { normalizeSearch } from "./normalizeSearch";

interface AutocompleteBaseEntry {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface AutocompleteModelEntry extends AutocompleteBaseEntry {
  kind: "model";
  code: string;
  name: string;
  aliases: string[];
  brandKo: string;
  brandEn: string;
  values: string[];
}

export interface AutocompleteConsumableEntry extends AutocompleteBaseEntry {
  kind: "part";
  partNumber: string;
  productName: string;
  productNames?: string[];
  displayName: string;
  keywords: string[];
  typeName: string;
}

export interface AutocompleteIndex {
  version: 1;
  models: AutocompleteModelEntry[];
  consumables: AutocompleteConsumableEntry[];
}

export interface AutocompleteSuggestion {
  id: string;
  entityId: string;
  kind: "model" | "part";
  title: string;
  description: string;
  status: string;
  url: string;
  score: number;
}

function scoreModel(model: AutocompleteModelEntry, query: string) {
  const q = normalizeSearch(query);
  if (!q) return 0;
  if (model.code === q) return 100;
  if (model.name === q) return 90;
  if (model.aliases.includes(q)) return 80;
  if (model.code.includes(q)) return 70;
  if (model.name.includes(q)) return 60;
  if (
    (q.includes(model.brandKo) || q.includes(model.brandEn)) &&
    model.values.some((value) => value.includes(q))
  ) {
    return 50;
  }
  if (model.values.some((value) => value.includes(q) || (value.length >= 3 && q.includes(value)))) {
    return 30;
  }

  const tokens = query
    .toLocaleLowerCase("ko-KR")
    .split(/[\s\-_]+/)
    .filter(Boolean);
  const haystack = model.values.join(" ");
  const matched = tokens.filter((token) => haystack.includes(normalizeSearch(token))).length;
  return matched > 0 ? 10 + matched : 0;
}

function scoreConsumable(part: AutocompleteConsumableEntry, query: string) {
  const q = normalizeSearch(query);
  const productNames = part.productNames ?? [part.productName];
  if (!q) return { score: 0, status: "소모품" };
  if (part.partNumber && part.partNumber === q) return { score: 120, status: "부품번호 일치" };
  if (part.typeName === q) return { score: 115, status: "소모품 종류 일치" };
  if (productNames.some((name) => name && name === q)) return { score: 110, status: "소모품" };
  if (part.displayName === q) return { score: 100, status: "소모품" };
  if (part.keywords.includes(q)) return { score: 95, status: "소모품" };
  if (part.partNumber && part.partNumber.includes(q)) {
    return { score: 90, status: "부품번호 일치" };
  }
  if (productNames.some((name) => name && name.includes(q))) return { score: 85, status: "소모품" };
  if (part.displayName.includes(q) || q.includes(part.displayName)) {
    return { score: 80, status: "소모품" };
  }
  if (part.keywords.some((value) => value.includes(q) || q.includes(value))) {
    return { score: 70, status: "소모품" };
  }
  if (part.typeName.includes(q) || q.includes(part.typeName)) {
    return { score: 60, status: "소모품" };
  }

  const tokens = query
    .toLocaleLowerCase("ko-KR")
    .split(/[\s\-_]+/)
    .map(normalizeSearch)
    .filter(Boolean);
  const haystack = [
    part.partNumber,
    ...productNames,
    part.displayName,
    ...part.keywords,
    part.typeName,
  ].join(" ");
  const matched = tokens.filter((token) => haystack.includes(token)).length;
  return matched > 0
    ? { score: 20 + matched * 5, status: "소모품" }
    : { score: 0, status: "소모품" };
}

export function searchAutocomplete(
  index: AutocompleteIndex,
  query: string,
  limit = 4,
): AutocompleteSuggestion[] {
  if (!normalizeSearch(query)) return [];

  const models: AutocompleteSuggestion[] = index.models
    .map((model) => ({ model, score: scoreModel(model, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.model.code.localeCompare(b.model.code))
    .slice(0, 4)
    .map(({ model, score }) => ({
      id: `model-${model.id}`,
      entityId: model.id,
      kind: "model",
      title: model.title,
      description: model.description,
      status: "모델",
      url: model.url,
      score,
    }));
  const consumables: AutocompleteSuggestion[] = index.consumables
    .map((part) => ({ part, ...scoreConsumable(part, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.part.title.localeCompare(b.part.title, "ko"))
    .slice(0, 4)
    .map(({ part, score, status }) => ({
      id: `part-${part.id}`,
      entityId: part.id,
      kind: "part",
      title: part.title,
      description: part.description,
      status,
      url: part.url,
      score,
    }));
  const modelIntent = (models[0]?.score ?? 0) >= 50;
  const ranked = (modelIntent ? models : [...models, ...consumables]).sort(
    (a, b) =>
      b.score - a.score ||
      (a.kind === b.kind ? a.title.localeCompare(b.title, "ko") : a.kind === "model" ? -1 : 1),
  );
  const topScore = ranked[0]?.score ?? 0;
  const primary = topScore < 30 ? ranked : ranked.filter(({ score }) => score === topScore);

  return primary.slice(0, limit);
}
