import type { ApplianceModel, ConsumableCompatibility } from "@/types";
import { categoryLabels, partTypeLabels } from "./labels";
import { getModelFullName } from "./modelDisplayName";
import { normalizeSearch } from "./normalizeSearch";
import type { AutocompleteIndex } from "./autocomplete";

function modelValues(model: ApplianceModel) {
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

export function createAutocompleteIndex(
  models: ApplianceModel[],
  consumables: ConsumableCompatibility[],
): AutocompleteIndex {
  return {
    version: 1,
    models: models.map((model) => ({
      id: model.id,
      kind: "model",
      title: getModelFullName(model),
      description: `${model.modelCode} · ${categoryLabels[model.category]}`,
      url: `/model/${model.brandId}/${model.slug}#compatible-parts`,
      code: normalizeSearch(model.modelCode),
      name: normalizeSearch(model.modelName),
      aliases: model.aliases.map(normalizeSearch),
      brandKo: normalizeSearch(model.brandName),
      brandEn: normalizeSearch(model.brandNameEn ?? ""),
      values: modelValues(model),
    })),
    consumables: consumables.map((part) => ({
      id: part.id,
      kind: "part",
      title: part.displayName,
      description: `${partTypeLabels[part.type]} · ${part.genuinePartNumber ?? "부품번호 정보 없음"}`,
      url: `/find?q=${encodeURIComponent(
        part.genuinePartNumber ?? part.displayName,
      )}&type=parts#part-${part.id}`,
      partNumber: normalizeSearch(part.genuinePartNumber ?? ""),
      productName: normalizeSearch(
        [part.productOptions[0]?.name, part.productOptions[0]?.packageLabel]
          .filter(Boolean)
          .join(" "),
      ),
      displayName: normalizeSearch(part.displayName),
      keywords: part.searchKeywords.map(normalizeSearch),
      typeName: normalizeSearch(partTypeLabels[part.type]),
    })),
  };
}
