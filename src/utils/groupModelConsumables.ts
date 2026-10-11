import type { ConsumableCompatibility } from "@/types";

const mainFilterIds = new Set([
  "lg-puricare-m-filter",
  "lg-puricare-g-filter",
  "lg-360-v2-filter",
  "lg-360-h-filter",
  "lg-360-m5-filter",
  "lg-as205ngja-compatible-hepa-filter",
]);

// Group only this model's already selected parts; keep source relationships separate.
export function groupModelConsumables(parts: ConsumableCompatibility[]) {
  const mainFilters = parts.filter((part) => mainFilterIds.has(part.id));
  if (mainFilters.length < 2) return parts;
  const primary = mainFilters.find((part) => part.id !== "lg-as205ngja-compatible-hepa-filter")!;
  const grouped: ConsumableCompatibility = {
    ...primary,
    displayName: "메인 필터",
    groupedParts: mainFilters,
    productOptions: mainFilters.flatMap((part) => part.productOptions),
    genuinePartNumber: undefined,
    compatibilities: primary.compatibilities.map((relation) => ({
      ...relation,
      configuration: {
        requiredQuantity: relation.configuration?.requiredQuantity,
        fitNote: "아래 상품 중 한 종류를 선택하세요.",
      },
    })),
    maintenance: primary.maintenance
      ? {
          ...primary.maintenance,
          detail: `${primary.maintenance.detail} · 선택한 상품의 관리 안내를 확인하세요.`,
        }
      : undefined,
  };
  return parts.flatMap((part) =>
    part.id === primary.id ? [grouped] : mainFilterIds.has(part.id) ? [] : [part],
  );
}
