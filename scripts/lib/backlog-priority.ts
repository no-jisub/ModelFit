import type { RawCatalog } from "./catalog-schema";

export interface ModelDemand {
  modelId: string;
  pageViews: number;
  purchaseClicks: number;
}

export function prioritizeBacklog(raw: RawCatalog, demand: ModelDemand[] = []) {
  const activeOptions = raw["product-options.csv"].filter((o) => o.isActive === "true");
  const activeLinks = raw["purchase-links.csv"].filter((l) => l.isActive === "true");
  return raw["models.csv"]
    .filter((m) => m.status === "published")
    .map((model) => {
      const relations = raw["model-consumables.csv"].filter((r) => r.modelId === model.id);
      const items = relations
        .map((r) => {
          const optionIds = activeOptions
            .filter((o) => o.consumableId === r.consumableId)
            .map((o) => o.id);
          const hasPurchase = activeLinks.some((l) => optionIds.includes(l.productOptionId));
          const confirmed = r.verificationStatus === "official" && r.evidenceScope === "scoped";
          return { compatibilityId: r.id, partId: r.consumableId, confirmed, hasPurchase };
        })
        .filter((r) => !r.confirmed || !r.hasPurchase);
      const counts = demand.find((d) => d.modelId === model.id);
      return {
        modelId: model.id,
        modelCode: model.modelCode,
        brandId: model.brandId,
        pageViews: counts?.pageViews ?? (demand.length ? 0 : null),
        purchaseClicks: counts?.purchaseClicks ?? (demand.length ? 0 : null),
        unverifiedWithPurchase: items.filter((r) => !r.confirmed && r.hasPurchase).length,
        verifiedWithoutPurchase: items.filter((r) => r.confirmed && !r.hasPurchase).length,
        unverifiedWithoutPurchase: items.filter((r) => !r.confirmed && !r.hasPurchase).length,
        items,
      };
    })
    .filter((r) => r.items.length > 0)
    .sort(
      (a, b) =>
        (b.purchaseClicks ?? 0) - (a.purchaseClicks ?? 0) ||
        (b.pageViews ?? 0) - (a.pageViews ?? 0) ||
        b.unverifiedWithPurchase - a.unverifiedWithPurchase ||
        b.verifiedWithoutPurchase - a.verifiedWithoutPurchase ||
        b.unverifiedWithoutPurchase - a.unverifiedWithoutPurchase ||
        a.modelCode.localeCompare(b.modelCode),
    );
}
