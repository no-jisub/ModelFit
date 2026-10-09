import type { CatalogFile, RawCatalog } from "./catalog-schema";
export const sqlTables: [CatalogFile, string][] = [
  ["categories.csv", "category"],
  ["brands.csv", "brand"],
  ["brand-categories.csv", "brandCategory"],
  ["brand-domains.csv", "brandDomain"],
  ["models.csv", "model"],
  ["model-aliases.csv", "modelAlias"],
  ["consumables.csv", "consumable"],
  ["model-consumables.csv", "modelConsumable"],
  ["sources.csv", "source"],
  ["model-sources.csv", "modelSource"],
  ["consumable-sources.csv", "consumableSource"],
  ["compatibility-sources.csv", "compatibilitySource"],
  ["images.csv", "modelImage"],
  ["product-options.csv", "productOption"],
  ["product-option-sources.csv", "productOptionSource"],
  ["consumable-images.csv", "consumableImage"],
  ["option-model-labels.csv", "optionModelLabel"],
  ["purchase-links.csv", "purchaseLink"],
  ["guidance-links.csv", "guidanceLink"],
];
export function createCatalogSeed(raw: RawCatalog) {
  const enumFields = [
    "status",
    "verificationStatus",
    "sourceType",
    "partNumberStatus",
    "kind",
    "verification",
    "channel",
  ];
  const references: Record<string, string> = {
    brandId: "brand",
    categoryId: "category",
    category: "category",
    modelId: "model",
    consumableId: "consumable",
    sourceId: "source",
    productOptionId: "productOption",
    compatibilityId: "compatibility",
  };
  const enumValue = (value: string) => value.toUpperCase().replaceAll("-", "_");
  const blocks = sqlTables
    .filter(([f]) => raw[f].length)
    .map(([file, table]) => {
      const rows = raw[file].map((input) => {
        const row: Record<string, unknown> = { ...input };
        if (file === "models.csv") {
          const [year, month, day] = (input.releaseDate || "").split("-").map(Number);
          delete row.releaseDate;
          row.releaseYear = year || null;
          row.releaseMonth = month || null;
          row.releaseDay = day || null;
          row.modelCodeNormalized = input.modelCode.toLowerCase().replace(/[\s-]/g, "");
        }
        if (file === "model-aliases.csv")
          row.aliasNormalized = input.alias.toLowerCase().replace(/[\s-]/g, "");
        if (file === "images.csv") {
          row.url = row.src;
          delete row.src;
        }
        if (file === "consumables.csv") row.status = "published";
        const fields = Object.entries(row).map(([key, value]) => {
          if (key === "searchKeywords")
            return key + ": " + JSON.stringify(String(value).split("|").filter(Boolean));
          if (references[key]) return references[key] + ": {id: " + JSON.stringify(value) + "}";
          if (enumFields.includes(key))
            return key + ": " + (value ? enumValue(String(value)) : "null");
          if (["sortOrder"].includes(key)) return key + ": " + Number(value);
          if (["isActive", "isPrimary", "isAffiliate"].includes(key))
            return key + ": " + (value === "true");
          return key + ": " + (value === null || value === "" ? "null" : JSON.stringify(value));
        });
        return "{ " + fields.join(", ") + " }";
      });
      return table + "_upsertMany(data: [" + rows.join(",\n") + "])";
    });
  return (
    "# LOCAL ONLY: generated from validated v2 private CSV. Parent records precede children.\nmutation ImportCatalog @transaction {\n" +
    blocks.join("\n") +
    "\n}\n"
  );
}
