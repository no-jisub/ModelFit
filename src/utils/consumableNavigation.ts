import { models } from "@/data/models";
import type { ConsumableCompatibility } from "@/types";

export function getConsumableModelPath(
  part: Pick<ConsumableCompatibility, "compatibleModelIds" | "displayName">,
) {
  const model = part.compatibleModelIds
    .map((modelId) => models.find((candidate) => candidate.id === modelId))
    .find((candidate) => candidate !== undefined);

  return model
    ? `/model/${model.brandId}/${model.slug}#compatible-parts`
    : `/find?q=${encodeURIComponent(part.displayName)}&type=parts`;
}
