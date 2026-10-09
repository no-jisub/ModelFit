import type {
  ApplianceModel,
  Brand,
  ConsumableCompatibility,
  ModelConsumable,
  ModelImage,
  SourceReference,
  ConsumableProductOption,
} from "../../src/types";
import type { RawCatalog, CatalogFile } from "./catalog-schema";
export function buildCatalogView(raw: RawCatalog) {
  const active = (row: Record<string, string>) => row.isActive !== "false";
  const sorted = (file: CatalogFile) =>
    [...raw[file]].filter(active).sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
  const optional = (value: string) => value || undefined;
  const sourcesById = new Map(
    raw["sources.csv"].filter(active).map((r) => [
      r.id,
      {
        id: r.id,
        title: r.title,
        url: r.url,
        sourceType: r.sourceType,
        checkedAt: r.checkedAt,
      } as SourceReference,
    ]),
  );
  const sources = (file: CatalogFile, field: string, id: string) =>
    raw[file]
      .filter((r) => r[field] === id)
      .map((r) => sourcesById.get(r.sourceId))
      .filter((r): r is SourceReference => Boolean(r));
  const categories = sorted("categories.csv").map(
    ({ id, label, selectorImage, description, modelNumberGuide }) => ({
      id,
      label,
      selectorImage,
      description,
      modelNumberGuide,
    }),
  );
  const brands: Brand[] = sorted("brands.csv").map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameEn: optional(r.nameEn),
    supportedCategories: raw["brand-categories.csv"]
      .filter((j) => j.brandId === r.id)
      .map((j) => j.categoryId) as Brand["supportedCategories"],
    officialDomains: raw["brand-domains.csv"]
      .filter((j) => j.brandId === r.id)
      .map((j) => j.domain),
  }));
  const relations: ModelConsumable[] = raw["model-consumables.csv"].map((r) => ({
    id: r.id,
    modelId: r.modelId,
    consumableId: r.consumableId,
    verificationStatus: r.verificationStatus as ModelConsumable["verificationStatus"],
    verifiedAt: r.verifiedAt,
    evidenceScope: r.evidenceScope as ModelConsumable["evidenceScope"],
    sources: sources("compatibility-sources.csv", "compatibilityId", r.id),
    configuration:
      r.itemCode || r.requiredQuantity || r.salesPackage || r.composition || r.fitNote
        ? {
            itemCode: optional(r.itemCode),
            requiredQuantity: optional(r.requiredQuantity),
            salesPackage: optional(r.salesPackage),
            composition: optional(r.composition),
            fitNote: optional(r.fitNote),
          }
        : undefined,
  }));
  const modelImages: Record<string, ModelImage> = Object.fromEntries(
    sorted("images.csv")
      .filter((r) => r.isPrimary === "true")
      .map((r) => [
        r.modelId,
        { src: r.src, alt: r.alt, sourceUrl: r.sourceUrl, checkedAt: r.checkedAt },
      ]),
  );
  const link = (r: Record<string, string>) => ({
    id: r.id,
    label: r.label,
    url: r.url,
    channel: r.channel,
    checkedAt: r.checkedAt,
  });
  const options: ConsumableProductOption[] = sorted("product-options.csv").map((r) => ({
    id: r.id,
    name: r.name,
    kind: r.kind,
    verification: r.verification,
    description: r.description,
    itemCode: optional(r.itemCode),
    packageLabel: optional(r.packageLabel),
    modelLabels: Object.fromEntries(
      raw["option-model-labels.csv"]
        .filter((j) => j.productOptionId === r.id)
        .map((j) => [j.modelId, j.label]),
    ),
    sources: sources("product-option-sources.csv", "productOptionId", r.id),
    purchaseLinks: raw["purchase-links.csv"]
      .filter((j) => j.productOptionId === r.id && active(j))
      .map((j) => ({
        ...link(j),
        isAffiliate: j.isAffiliate === "true",
        purchaseScope: j.purchaseScope,
        linkType: "direct-product",
      })),
    guidanceLinks: raw["guidance-links.csv"]
      .filter((j) => j.productOptionId === r.id && active(j))
      .map((j) => ({ ...link(j), linkType: "official-reference" })),
  })) as ConsumableProductOption[];
  const consumables: ConsumableCompatibility[] = sorted("consumables.csv").map((r) => ({
    id: r.id,
    slug: r.slug,
    type: r.type,
    displayName: r.displayName,
    genuinePartNumber: optional(r.genuinePartNumber),
    partNumberStatus: r.partNumberStatus,
    compatibleModelIds: relations.filter((j) => j.consumableId === r.id).map((j) => j.modelId),
    compatibilities: relations.filter((j) => j.consumableId === r.id),
    searchKeywords: r.searchKeywords.split("|").filter(Boolean),
    maintenance: r.maintenanceMode
      ? { mode: r.maintenanceMode, detail: r.maintenanceDetail }
      : undefined,
    purchaseWarning: optional(r.purchaseWarning),
    verificationStatus: r.verificationStatus,
    sources: sources("consumable-sources.csv", "consumableId", r.id),
    productOptions: options.filter(
      (o) => raw["product-options.csv"].find((j) => j.id === o.id)?.consumableId === r.id,
    ),
  })) as ConsumableCompatibility[];
  const models: ApplianceModel[] = raw["models.csv"]
    .filter((r) => r.status === "published")
    .map((r) => {
      const brand = brands.find((b) => b.id === r.brandId)!;
      return {
        id: r.id,
        slug: r.slug,
        status: r.status,
        category: r.category,
        brandId: r.brandId,
        brandName: brand.name,
        brandNameEn: brand.nameEn ?? brand.name,
        modelName: r.modelName,
        modelCode: r.modelCode,
        aliases: raw["model-aliases.csv"].filter((j) => j.modelId === r.id).map((j) => j.alias),
        series: optional(r.series),
        image: modelImages[r.id],
        releaseDate: optional(r.releaseDate),
        consumableIds: relations.filter((j) => j.modelId === r.id).map((j) => j.consumableId),
        sources: sources("model-sources.csv", "modelId", r.id),
        lastVerifiedAt: r.verifiedAt,
        verificationStatus: r.verificationStatus,
      };
    }) as ApplianceModel[];
  const modelConsumableIds = Object.fromEntries(models.map((m) => [m.id, m.consumableIds]));
  return { categories, brands, consumables, models, relations, modelImages, modelConsumableIds };
}
