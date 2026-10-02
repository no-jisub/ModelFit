import type { ConsumableCompatibility } from "@/types";
export type { PartConfigurationPresentation, MaintenancePresentation } from "@/types";
export function getPartConfiguration(part: ConsumableCompatibility, modelId: string) {
  return part.compatibilities.find((r) => r.modelId === modelId)?.configuration;
}
export function getMaintenancePresentation(part: ConsumableCompatibility) {
  return part.maintenance;
}
