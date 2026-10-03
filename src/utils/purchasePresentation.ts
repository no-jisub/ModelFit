import type { ConsumableProductOption, PartConfigurationPresentation } from "@/types";

const verificationOrder: Record<ConsumableProductOption["verification"], number> = {
  "official-genuine": 0,
  "verified-compatible": 1,
  "seller-claimed": 2,
  unverified: 3,
};

export function groupPurchaseOptions(options: ConsumableProductOption[]) {
  const ordered = options
    .map((option, index) => ({ option, index }))
    .sort(
      (a, b) =>
        verificationOrder[a.option.verification] - verificationOrder[b.option.verification] ||
        Number(a.option.kind !== "genuine") - Number(b.option.kind !== "genuine") ||
        a.index - b.index,
    )
    .map(({ option }) => option);
  return {
    available: ordered.filter((option) => option.purchaseLinks.length > 0),
    reference: ordered.filter((option) => option.purchaseLinks.length === 0),
  };
}

// A replacement requirement is not a seller's pack quantity.
export function getSalesPackageLabel(
  label: string | undefined,
  configuration: PartConfigurationPresentation | undefined,
  modelCode: string,
): string {
  if (!label?.trim()) return "판매 구성 확인 필요";
  const requiredQuantity = configuration?.requiredQuantity;
  if (requiredQuantity && label.includes(requiredQuantity)) {
    let remainder = label.replace(requiredQuantity, "").replace(modelCode, "");
    if (configuration?.itemCode) remainder = remainder.replace(configuration.itemCode, "");
    if (!remainder.replace(/[\s·,/:|()-]/g, "")) return "판매 구성 확인 필요";
  }
  return label;
}
