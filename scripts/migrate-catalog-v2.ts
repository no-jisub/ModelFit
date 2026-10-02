import { readFile, writeFile, mkdir, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseCsvRows, type CsvRow } from "./lib/catalog-csv";
import {
  catalogSchema,
  encodeCsv,
  validateRawCatalog,
  type RawCatalog,
  type CatalogFile,
} from "./lib/catalog-schema";
import { formatPackageLabelForModel } from "./lib/migration-package-label";
import { toModelId, toModelSlug } from "../src/utils/modelSlug";
import { legacyConfiguration, legacyMaintenance } from "./lib/catalog-v1";
const args = process.argv.slice(2);
const from = args[args.indexOf("--from") + 1];
if (!args.includes("--from") || !from)
  throw new Error(
    "Use --from verified v1 backup directory. Default is dry run; --apply writes v2 CSV.",
  );
const root = path.resolve(from);
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
for (const entry of manifest.files) {
  const bytes = await readFile(path.join(root, entry.path));
  if (createHash("sha256").update(bytes).digest("hex") !== entry.sha256)
    throw new Error("Backup hash mismatch: " + entry.path);
}
const read = async (file: string) => {
  const rows = parseCsvRows(await readFile(path.join(root, file), "utf8"));
  const headers = rows.shift()!;
  return rows.map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
};
const raw = Object.fromEntries(
  Object.keys(catalogSchema).map((f) => [f, []]),
) as unknown as RawCatalog;
for (const f of [
  "categories.csv",
  "brands.csv",
  "consumables.csv",
  "sources.csv",
  "product-options.csv",
  "purchase-links.csv",
  "images.csv",
  "model-consumables.csv",
] as CatalogFile[])
  raw[f] = await read("data/catalog/" + f);
const oldModels = await read("data/import/models.csv");
const joins = await read("data/catalog/entity-sources.csv");
const pick = (row: CsvRow, headers: string) =>
  Object.fromEntries(headers.split(",").map((h) => [h, row[h] ?? ""]));
for (const brand of raw["brands.csv"]) {
  for (const categoryId of brand.supportedCategories.split("|").filter(Boolean))
    raw["brand-categories.csv"].push({ brandId: brand.id, categoryId });
  for (const domain of brand.officialDomains.split("|").filter(Boolean))
    raw["brand-domains.csv"].push({ brandId: brand.id, domain });
}
for (const [type, file, field] of [
  ["consumable", "consumable-sources.csv", "consumableId"],
  ["product-option", "product-option-sources.csv", "productOptionId"],
])
  raw[file as CatalogFile] = joins
    .filter((r) => r.entityType === type)
    .map((r) => ({ [field]: r.entityId, sourceId: r.sourceId }));
const sourceId = (source: CsvRow) => {
  const existing = raw["sources.csv"].find(
    (r) =>
      r.url === source.url &&
      r.title === source.title &&
      r.sourceType === source.sourceType &&
      r.checkedAt === source.checkedAt,
  );
  if (existing) return existing.id;
  const id =
    "migration-source-" +
    createHash("sha256").update(JSON.stringify(source)).digest("hex").slice(0, 16);
  raw["sources.csv"].push({ id, ...source, isActive: "true" });
  return id;
};
for (const old of oldModels) {
  const brand = raw["brands.csv"].find((b) => b.id === old.brandId)!;
  const model = {
    id: toModelId(old.brandId, old.modelCode),
    slug: toModelSlug(old.modelCode),
    verificationStatus: old.status === "published" ? "official" : "unverified",
    aliases: [
      ...new Set([
        brand.name + " " + old.modelCode,
        (brand.nameEn || brand.name) + " " + old.modelCode,
        old.modelName,
        ...old.aliases
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean),
      ]),
    ],
    sources: [
      {
        title: old.sourceTitle,
        url: old.sourceUrl,
        sourceType: old.sourceType,
        checkedAt: old.verifiedAt,
      },
      ...(old.releaseSourceUrl
        ? [
            {
              title: "다나와 모델 등록월 정보",
              url: old.releaseSourceUrl,
              sourceType: "other",
              checkedAt: old.verifiedAt,
            },
          ]
        : []),
    ],
  };
  raw["models.csv"].push({
    ...pick(old, catalogSchema["models.csv"]),
    id: model.id,
    slug: model.slug,
    status: old.status,
    verificationStatus: model.verificationStatus,
  });
  for (const alias of model.aliases) raw["model-aliases.csv"].push({ modelId: model.id, alias });
  for (const [i, source] of model.sources.entries())
    raw["model-sources.csv"].push({
      modelId: model.id,
      sourceId: sourceId(source),
      purpose: i === 0 ? "model-info" : "release-date",
    });
}
for (const row of raw["model-consumables.csv"]) {
  const model = raw["models.csv"].find((m) => m.id === row.modelId)!;
  const configuration =
    legacyConfiguration(
      raw["product-options.csv"].filter((o) => o.consumableId === row.consumableId),
      model.modelCode,
    ) ?? {};
  Object.assign(row, {
    id: row.modelId + "__" + row.consumableId,
    evidenceScope: "legacy-unscoped",
    ...configuration,
  });
}
for (const row of raw["consumables.csv"]) {
  const maintenance = legacyMaintenance(row);
  Object.assign(row, {
    maintenanceMode: maintenance?.mode ?? "",
    maintenanceDetail: maintenance?.detail ?? "",
  });
}
for (const option of raw["product-options.csv"]) {
  option.itemCode = option.partNumber;
  if (option.packageLabel)
    for (const relation of raw["model-consumables.csv"].filter(
      (r) => r.consumableId === option.consumableId,
    )) {
      const model = raw["models.csv"].find((m) => m.id === relation.modelId)!;
      raw["option-model-labels.csv"].push({
        productOptionId: option.id,
        modelId: model.id,
        label: formatPackageLabelForModel(option.packageLabel, model.modelCode),
      });
    }
}
raw["guidance-links.csv"] = raw["purchase-links.csv"].filter(
  (r) => r.linkType === "official-reference",
);
if (
  raw["purchase-links.csv"].some(
    (r) => !["official-reference", "direct-product"].includes(r.linkType),
  )
)
  throw new Error("Review unsupported link type before migration");
raw["purchase-links.csv"] = raw["purchase-links.csv"].filter(
  (r) => r.linkType === "direct-product",
);
for (const file of Object.keys(catalogSchema) as CatalogFile[])
  raw[file] = raw[file].map((r) => pick(r, catalogSchema[file]));
const errors = validateRawCatalog(raw);
if (errors.length) throw new Error(errors.join("\n"));
const review = {
  version: 2,
  backup: root,
  counts: Object.fromEntries(Object.entries(raw).map(([f, r]) => [f, r.length])),
  compatibilityEvidence: raw["model-consumables.csv"].map((r) => ({
    id: r.id,
    reason:
      "Inherited verification lacks relation-scoped source; attach evidence before promoting to scoped.",
  })),
  itemCodes: raw["product-options.csv"]
    .filter(
      (o) =>
        o.itemCode &&
        o.itemCode !==
          raw["consumables.csv"].find((p) => p.id === o.consumableId)?.genuinePartNumber,
    )
    .map((o) => ({
      id: o.id,
      itemCode: o.itemCode,
      reason: "Product/package code retained without assuming genuine part number.",
    })),
  maintenance: raw["consumables.csv"]
    .filter((r) => r.maintenanceMode)
    .map((r) => ({
      id: r.id,
      reason: "Existing presentation preserved; verify structured maintenance against source.",
    })),
  quantities: raw["model-consumables.csv"]
    .filter((r) => r.requiredQuantity || r.salesPackage || r.composition)
    .map((r) => ({
      id: r.id,
      reason: "Existing text presentation preserved; no numeric quantity inferred.",
    })),
};
await mkdir("outputs/normalization", { recursive: true });
await writeFile("outputs/normalization/review-v2.json", JSON.stringify(review, null, 2));
const staging = path.resolve("outputs/normalization/v2-staged");
await mkdir(staging, { recursive: true });
for (const f of Object.keys(catalogSchema) as CatalogFile[])
  await writeFile(path.join(staging, f), encodeCsv(catalogSchema[f], raw[f]));
if (args.includes("--apply")) {
  for (const f of Object.keys(catalogSchema) as CatalogFile[])
    await copyFile(path.join(staging, f), path.resolve("data/catalog", f));
  await rm(path.resolve("data/catalog/entity-sources.csv"), { force: true });
  await rm(path.resolve("data/import/models.csv"), { force: true });
}
console.log(
  JSON.stringify(
    {
      applied: args.includes("--apply"),
      counts: review.counts,
      review: "outputs/normalization/review-v2.json",
    },
    null,
    2,
  ),
);
