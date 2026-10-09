import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseCsvRows, type CsvRow } from "./catalog-csv";

export const catalogSchema = {
  "categories.csv": "id,label,selectorImage,description,modelNumberGuide,sortOrder,isActive",
  "brands.csv": "id,slug,name,nameEn,sortOrder,isActive",
  "brand-categories.csv": "brandId,categoryId",
  "brand-domains.csv": "brandId,domain",
  "models.csv":
    "id,slug,status,verificationStatus,category,brandId,modelName,modelCode,series,releaseDate,verifiedAt",
  "model-aliases.csv": "modelId,alias",
  "consumables.csv":
    "id,slug,type,displayName,genuinePartNumber,partNumberStatus,searchKeywords,maintenanceMode,maintenanceDetail,purchaseWarning,verificationStatus,sortOrder",
  "model-consumables.csv":
    "id,modelId,consumableId,verificationStatus,verifiedAt,evidenceScope,itemCode,requiredQuantity,salesPackage,composition,fitNote",
  "sources.csv": "id,title,url,sourceType,checkedAt,isActive",
  "model-sources.csv": "modelId,sourceId,purpose",
  "consumable-sources.csv": "consumableId,sourceId",
  "product-option-sources.csv": "productOptionId,sourceId",
  "compatibility-sources.csv": "compatibilityId,sourceId",
  "product-options.csv":
    "id,consumableId,name,kind,verification,description,itemCode,packageLabel,sortOrder,isActive",
  "option-model-labels.csv": "productOptionId,modelId,label",
  "purchase-links.csv":
    "id,productOptionId,label,url,channel,isAffiliate,checkedAt,isActive,purchaseScope,priceKeyword,priceProductId,priceItemId,priceVendorItemId",
  "guidance-links.csv": "id,productOptionId,label,url,channel,checkedAt,isActive",
  "images.csv": "id,modelId,src,alt,sourceUrl,checkedAt,sortOrder,isPrimary",
} as const;
export type CatalogFile = keyof typeof catalogSchema;
export type RawCatalog = Record<CatalogFile, CsvRow[]>;
const keys: Partial<Record<CatalogFile, string[]>> = {
  "brand-categories.csv": ["brandId", "categoryId"],
  "brand-domains.csv": ["brandId", "domain"],
  "model-aliases.csv": ["modelId", "alias"],
  "model-sources.csv": ["modelId", "sourceId"],
  "consumable-sources.csv": ["consumableId", "sourceId"],
  "product-option-sources.csv": ["productOptionId", "sourceId"],
  "compatibility-sources.csv": ["compatibilityId", "sourceId"],
  "option-model-labels.csv": ["productOptionId", "modelId"],
};
export function validateRawCatalog(raw: RawCatalog): string[] {
  const required: Partial<Record<CatalogFile, string[]>> = {
    "categories.csv": ["label", "modelNumberGuide"],
    "brands.csv": ["slug", "name"],
    "consumables.csv": ["slug", "displayName"],
    "sources.csv": ["title"],
    "product-options.csv": ["name", "description"],
    "images.csv": ["src", "alt"],
    "purchase-links.csv": ["label"],
    "guidance-links.csv": ["label"],
    "option-model-labels.csv": ["label"],
  };
  const errors: string[] = [];
  const fk = {
    brandId: "brands.csv",
    categoryId: "categories.csv",
    category: "categories.csv",
    modelId: "models.csv",
    consumableId: "consumables.csv",
    productOptionId: "product-options.csv",
    sourceId: "sources.csv",
    compatibilityId: "model-consumables.csv",
  } as const;
  const enums: Record<string, string[]> = {
    status: ["draft", "review", "published", "archived"],
    verificationStatus: ["official", "seller-confirmed", "user-reported", "unverified"],
    sourceType: ["manufacturer", "official-manual", "official-store", "seller", "other"],
    partNumberStatus: ["confirmed", "not-listed", "researching"],
    kind: ["genuine", "compatible"],
    verification: ["official-genuine", "verified-compatible", "seller-claimed", "unverified"],
    channel: ["official", "coupang", "other"],
    purchaseScope: ["individual", "bundle"],
    purpose: ["model-info", "release-date"],
    evidenceScope: ["legacy-unscoped", "scoped"],
    maintenanceMode: ["정기 교체", "세척 후 재사용", "상태에 따라 교체", "정기 관리"],
    type: [
      "hepa-filter",
      "dust-filter",
      "deodorizing-filter",
      "pre-filter",
      "custom-filter",
      "all-in-one-filter",
      "dust-bin-filter",
      "dust-bag",
      "main-brush",
      "side-brush",
      "mop-pad",
    ],
  };
  for (const file of Object.keys(catalogSchema) as CatalogFile[]) {
    const seen = new Set<string>();
    for (const [index, row] of raw[file].entries()) {
      const label = file + " " + (index + 2);
      for (const field of required[file] ?? [])
        if (!row[field]?.trim()) errors.push(label + ": missing " + field);
      const fields = keys[file] ?? ["id"];
      const key = fields.map((field) => row[field]).join("\0");
      if (fields.some((field) => !row[field]) || seen.has(key))
        errors.push(label + ": missing or duplicate key " + key);
      seen.add(key);
      for (const [field, value] of Object.entries(row)) {
        if (field in fk && !raw[fk[field as keyof typeof fk]].some((target) => target.id === value))
          errors.push(label + ": invalid reference " + field);
        if (enums[field] && (!value ? field !== "maintenanceMode" : !enums[field].includes(value)))
          errors.push(label + ": invalid enum " + field);
        if (
          ["isActive", "isPrimary", "isAffiliate"].includes(field) &&
          !["true", "false"].includes(value)
        )
          errors.push(label + ": invalid boolean " + field);
        if (field === "sortOrder" && !/^\d+$/.test(value))
          errors.push(label + ": invalid sortOrder");
        if (
          ["checkedAt", "verifiedAt"].includes(field) &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
            Number.isNaN(Date.parse(value)) ||
            new Date(value).toISOString().slice(0, 10) !== value)
        )
          errors.push(label + ": invalid date " + field);
        if (["url", "sourceUrl"].includes(field)) {
          try {
            if (new URL(value).protocol !== "https:") throw Error();
          } catch {
            errors.push(label + ": invalid HTTPS " + field);
          }
        }
      }
      if (
        file === "consumables.csv" &&
        Boolean(row.genuinePartNumber) !== (row.partNumberStatus === "confirmed")
      )
        errors.push(label + ": inconsistent part number");
      if (
        file === "consumables.csv" &&
        Boolean(row.maintenanceMode) !== Boolean(row.maintenanceDetail)
      )
        errors.push(label + ": incomplete maintenance");
      if (
        file === "brand-domains.csv" &&
        !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(row.domain)
      )
        errors.push(label + ": invalid domain");
      if (file === "models.csv") {
        if (!row.slug || !row.modelName || !row.modelCode)
          errors.push(label + ": incomplete model");
        if (
          !raw["brand-categories.csv"].some(
            (r) => r.brandId === row.brandId && r.categoryId === row.category,
          )
        )
          errors.push(label + ": unsupported brand category");
        const fullRelease =
          row.releaseDate?.length === 7 ? row.releaseDate + "-01" : row.releaseDate;
        if (
          fullRelease &&
          (Number.isNaN(Date.parse(fullRelease)) ||
            new Date(fullRelease).toISOString().slice(0, 10) !== fullRelease)
        )
          errors.push(label + ": invalid release calendar date");
        if (
          row.releaseDate &&
          !/^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/.test(row.releaseDate)
        )
          errors.push(label + ": invalid release date");
        if (
          row.releaseDate &&
          !raw["model-sources.csv"].some(
            (r) => r.modelId === row.id && r.purpose === "release-date",
          )
        )
          errors.push(label + ": missing release evidence");
        if (
          row.status === "published" &&
          !raw["model-sources.csv"].some((r) => r.modelId === row.id && r.purpose === "model-info")
        )
          errors.push(label + ": missing model evidence");
      }
      if (
        file === "model-consumables.csv" &&
        row.evidenceScope === "scoped" &&
        !raw["compatibility-sources.csv"].some((r) => r.compatibilityId === row.id)
      )
        errors.push(label + ": scoped evidence missing");
      if (
        file === "model-consumables.csv" &&
        row.evidenceScope === "scoped" &&
        row.verificationStatus === "official"
      ) {
        const model = raw["models.csv"].find((m) => m.id === row.modelId);
        const domains = raw["brand-domains.csv"]
          .filter((d) => d.brandId === model?.brandId)
          .map((d) => d.domain);
        const linked = raw["compatibility-sources.csv"].filter((j) => j.compatibilityId === row.id);
        for (const join of linked) {
          const source = raw["sources.csv"].find((s) => s.id === join.sourceId);
          let officialHost = false;
          try {
            const host = new URL(source?.url ?? "").hostname;
            officialHost = domains.some((d) => host === d || host.endsWith("." + d));
          } catch {
            /* Invalid source URL is reported by the source validator. */
          }
          if (
            !source ||
            source.isActive !== "true" ||
            !["manufacturer", "official-manual", "official-store"].includes(source.sourceType) ||
            !officialHost
          )
            errors.push(label + ": official compatibility requires active manufacturer evidence");
        }
      }
      if (file === "option-model-labels.csv") {
        const option = raw["product-options.csv"].find((o) => o.id === row.productOptionId);
        if (
          !raw["model-consumables.csv"].some(
            (r) => r.modelId === row.modelId && r.consumableId === option?.consumableId,
          )
        )
          errors.push(label + ": option not compatible with model");
      }
      if (
        file === "purchase-links.csv" &&
        row.isAffiliate === "true" &&
        (row.channel !== "coupang" || !/^https:\/\/link\.coupang\.com\/a\//.test(row.url))
      )
        errors.push(label + ": invalid affiliate URL");
      if (file === "purchase-links.csv" && row.priceKeyword) {
        if (
          row.channel !== "coupang" ||
          ![row.priceProductId, row.priceItemId, row.priceVendorItemId].every((v) =>
            /^\d+$/.test(v ?? ""),
          )
        )
          errors.push(label + ": price requires exact Coupang product, item and vendor item");
      }
    }
  }
  for (const [file, fields] of [
    ["models.csv", ["brandId", "slug"]],
    ["models.csv", ["brandId", "modelCode"]],
    ["model-consumables.csv", ["modelId", "consumableId"]],
    ["brands.csv", ["slug"]],
    ["consumables.csv", ["slug"]],
  ] as [CatalogFile, string[]][]) {
    const seen = new Set<string>();
    for (const row of raw[file]) {
      const key = fields.map((f) => row[f].toLowerCase()).join("\0");
      if (seen.has(key)) errors.push(file + ": duplicate " + fields.join("/"));
      seen.add(key);
    }
  }
  const allLinks = [...raw["purchase-links.csv"], ...raw["guidance-links.csv"]];
  if (new Set(allLinks.map((l) => l.id)).size !== allLinks.length)
    errors.push("Link IDs overlap between guidance and purchases");
  const normalized = new Set<string>();
  for (const row of raw["models.csv"]) {
    const key = row.brandId + "/" + row.modelCode.toLowerCase().replace(/[\s-]/g, "");
    if (normalized.has(key)) errors.push("models.csv: duplicate normalized model code");
    normalized.add(key);
  }
  const primaries = raw["images.csv"].filter((r) => r.isPrimary === "true").map((r) => r.modelId);
  if (new Set(primaries).size !== primaries.length)
    errors.push("images.csv: multiple primary images");
  for (const model of raw["models.csv"].filter((r) => r.status === "published")) {
    if (
      !raw["brands.csv"].some((b) => b.id === model.brandId && b.isActive === "true") ||
      !raw["categories.csv"].some((c) => c.id === model.category && c.isActive === "true")
    )
      errors.push(model.id + ": published model references inactive metadata");
    if (!raw["model-consumables.csv"].some((r) => r.modelId === model.id))
      errors.push(model.id + ": published model has no consumables");
    for (const join of raw["model-sources.csv"].filter((r) => r.modelId === model.id)) {
      const source = raw["sources.csv"].find((s) => s.id === join.sourceId);
      if (source?.isActive !== "true") errors.push(model.id + ": inactive source");
    }
  }
  return errors;
}
export function parseRawCatalogFiles(files: Record<string, string>): RawCatalog {
  const entries = (Object.keys(catalogSchema) as CatalogFile[]).map((file) => {
    if (typeof files[file] !== "string") throw new Error(file + ": missing CSV");
    const rows = parseCsvRows(files[file]);
    const headers = rows.shift() ?? [];
    if (headers.join(",") !== catalogSchema[file]) throw new Error(file + ": unexpected headers");
    return [
      file,
      rows.map((values, index) => {
        if (values.length !== headers.length)
          throw new Error(file + " " + (index + 2) + ": unexpected column count");
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      }),
    ];
  });
  const raw = Object.fromEntries(entries) as RawCatalog;
  const errors = validateRawCatalog(raw);
  if (errors.length) throw new Error(errors.join("\n"));
  return raw;
}
export async function loadRawCatalog(
  directory = path.resolve("data/catalog"),
): Promise<RawCatalog> {
  const entries = await Promise.all(
    Object.keys(catalogSchema).map(async (file) => [
      file,
      await readFile(path.join(directory, file), "utf8"),
    ]),
  );
  return parseRawCatalogFiles(Object.fromEntries(entries));
}
export function encodeCsv(headers: string, rows: CsvRow[]) {
  const quote = (value: string) => '"' + value.replaceAll('"', '""') + '"';
  return (
    "\uFEFF" +
    headers +
    "\r\n" +
    rows
      .map((row) =>
        headers
          .split(",")
          .map((h) => quote(row[h] ?? ""))
          .join(","),
      )
      .join("\r\n") +
    "\r\n"
  );
}
