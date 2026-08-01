import type { ApplianceModel } from "@/types";

export interface ModelGroup {
  key: string;
  models: ApplianceModel[];
}

export function groupModelsByName(models: ApplianceModel[]): ModelGroup[] {
  const groups = new Map<string, ApplianceModel[]>();

  for (const model of models) {
    const key = `${model.brandId}:${model.modelName.trim().toLocaleLowerCase("ko")}`;
    const group = groups.get(key);

    if (group) group.push(model);
    else groups.set(key, [model]);
  }

  return Array.from(groups, ([key, groupedModels]) => ({
    key,
    models: [...groupedModels].sort((a, b) => a.modelCode.localeCompare(b.modelCode, "ko")),
  }));
}
