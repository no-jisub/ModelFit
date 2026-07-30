import type { ApplianceModel } from "@/types";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getModelDisplayName(model: ApplianceModel) {
  const brandAliases = [
    model.brandName,
    model.brandNameEn ?? "",
    ...model.brandName.split(/\s+/),
  ]
    .map((value) => value.trim())
    .filter((value) => value.length >= 2)
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort((a, b) => b.length - a.length);

  let displayName = model.modelName.trim();

  for (const alias of brandAliases) {
    displayName = displayName
      .replace(new RegExp(`^${escapeRegExp(alias)}(?:\\s+|[·:：-]\\s*)`, "i"), "")
      .trim();
  }

  return displayName || model.modelName;
}

export function getModelFullName(model: ApplianceModel) {
  return `${model.brandName} ${getModelDisplayName(model)}`.trim();
}
