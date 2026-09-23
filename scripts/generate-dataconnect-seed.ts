import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { parseModelCsv } from "../src/utils/catalogCsv";
import { toModelId, toModelSlug } from "../src/utils/modelSlug";
import {
  csvBoolean,
  csvInteger,
  optionalCsv,
  readCatalogCsv,
  splitList,
  type CsvRow,
} from "./lib/catalog-csv";

const outputPath = path.resolve("dataconnect/seed_data.gql");
const quote = (value: string) => JSON.stringify(value);
const field = (name: string, value: string | number | boolean | undefined) => {
  if (value === undefined || value === "") return `${name}: null`;
  return `${name}: ${typeof value === "string" ? quote(value) : String(value)}`;
};
const enumField = (name: string, value: string | undefined) =>
  value ? `${name}: ${value}` : `${name}: null`;
const listField = (name: string, values: string[]) => `${name}: [${values.map(quote).join(", ")}]`;
const reference = (name: string, id: string) => `${name}: { id: ${quote(id)} }`;
const object = (fields: Array<string | null>) => `{ ${fields.filter(Boolean).join(", ")} }`;

function mapped(map: Record<string, string>, value: string, label: string) {
  const result = map[value];
  if (!result) throw new Error(`${label} 변환값이 없습니다: ${value}`);
  return result;
}

function releaseParts(value?: string) {
  if (!value) return {};
  const [year, month, day] = value.split("-").map(Number);
  return { releaseYear: year, releaseMonth: month, releaseDay: day };
}

const sourceTypeMap: Record<string, string> = {
  manufacturer: "MANUFACTURER",
  "official-manual": "OFFICIAL_MANUAL",
  "official-store": "OFFICIAL_STORE",
  seller: "SELLER",
  other: "OTHER",
};
const verificationMap: Record<string, string> = {
  official: "OFFICIAL",
  "seller-confirmed": "SELLER_CONFIRMED",
  "user-reported": "USER_REPORTED",
  unverified: "UNVERIFIED",
};
const partNumberStatusMap: Record<string, string> = {
  confirmed: "CONFIRMED",
  "not-listed": "NOT_LISTED",
  researching: "RESEARCHING",
};
const optionKindMap: Record<string, string> = {
  genuine: "GENUINE",
  compatible: "COMPATIBLE",
};
const optionVerificationMap: Record<string, string> = {
  "official-genuine": "OFFICIAL_GENUINE",
  "verified-compatible": "VERIFIED_COMPATIBLE",
  "seller-claimed": "SELLER_CLAIMED",
  unverified: "UNVERIFIED",
};
const purchaseChannelMap: Record<string, string> = {
  official: "OFFICIAL",
  coupang: "COUPANG",
  other: "OTHER",
};
const purchaseLinkTypeMap: Record<string, string> = {
  "official-reference": "OFFICIAL_REFERENCE",
  "direct-product": "DIRECT_PRODUCT",
  "search-results": "SEARCH_RESULTS",
};

const [
  categories,
  brands,
  consumables,
  modelConsumables,
  sources,
  entitySources,
  productOptions,
  purchaseLinks,
  images,
] = await Promise.all([
  readCatalogCsv("categories.csv"),
  readCatalogCsv("brands.csv"),
  readCatalogCsv("consumables.csv"),
  readCatalogCsv("model-consumables.csv"),
  readCatalogCsv("sources.csv"),
  readCatalogCsv("entity-sources.csv"),
  readCatalogCsv("product-options.csv"),
  readCatalogCsv("purchase-links.csv"),
  readCatalogCsv("images.csv"),
]);
const modelRecords = parseModelCsv(await readFile(path.resolve("data/import/models.csv"), "utf8"));

const categoryRows = categories.map((row) =>
  object([
    field("id", row.id),
    field("slug", row.slug),
    field("label", row.label),
    field("selectorImage", optionalCsv(row.selectorImage)),
    field("description", optionalCsv(row.description)),
    field("metaDescription", optionalCsv(row.metaDescription)),
    field("modelNumberGuide", optionalCsv(row.modelNumberGuide)),
    listField("partTypes", splitList(row.partTypes)),
    field("sortOrder", csvInteger(row.sortOrder)),
    field("isActive", csvBoolean(row.isActive)),
  ]),
);

const brandRows = brands.map((row) =>
  object([
    field("id", row.id),
    field("slug", row.slug),
    field("name", row.name),
    field("nameEn", optionalCsv(row.nameEn)),
    listField("officialDomains", splitList(row.officialDomains)),
    field("sortOrder", csvInteger(row.sortOrder)),
    field("isActive", csvBoolean(row.isActive)),
  ]),
);

const brandCategoryRows = brands.flatMap((row) =>
  splitList(row.supportedCategories).map((categoryId) =>
    object([reference("brand", row.id), reference("category", categoryId)]),
  ),
);

const modelRows = modelRecords.map(({ values }) => {
  const release = releaseParts(values.releaseDate);
  return object([
    field("id", toModelId(values.brandId, values.modelCode)),
    field("slug", toModelSlug(values.modelCode)),
    reference("category", values.category),
    reference("brand", values.brandId),
    field("modelName", values.modelName),
    field("modelCode", values.modelCode),
    field("modelCodeNormalized", values.modelCode.toLowerCase().replace(/[\s-]/g, "")),
    field("series", optionalCsv(values.series)),
    enumField("status", values.status === "published" ? "PUBLISHED" : "DRAFT"),
    enumField("verificationStatus", values.status === "published" ? "OFFICIAL" : "UNVERIFIED"),
    field("sourceUrl", optionalCsv(values.sourceUrl)),
    field("sourceTitle", optionalCsv(values.sourceTitle)),
    enumField(
      "sourceType",
      values.sourceType
        ? mapped(sourceTypeMap, values.sourceType, "models.csv sourceType")
        : undefined,
    ),
    field("verifiedAt", optionalCsv(values.verifiedAt)),
    field("releaseYear", release.releaseYear),
    field("releaseMonth", release.releaseMonth),
    field("releaseDay", release.releaseDay),
    field("releaseSourceUrl", optionalCsv(values.releaseSourceUrl)),
  ]);
});

const modelAliasRows = modelRecords.flatMap(({ values }) =>
  splitList(values.aliases).map((alias) =>
    object([
      reference("model", toModelId(values.brandId, values.modelCode)),
      field("alias", alias),
      field("aliasNormalized", alias.toLowerCase().replace(/[\s-]/g, "")),
    ]),
  ),
);

const consumableRows = consumables.map((row) =>
  object([
    field("id", row.id),
    field("slug", row.slug),
    field("type", row.type),
    field("displayName", row.displayName),
    field("genuinePartNumber", optionalCsv(row.genuinePartNumber)),
    enumField(
      "partNumberStatus",
      mapped(partNumberStatusMap, row.partNumberStatus, "consumables.csv partNumberStatus"),
    ),
    field("compatibleProductName", optionalCsv(row.compatibleProductName)),
    listField("searchKeywords", splitList(row.searchKeywords)),
    field("replacementInterval", optionalCsv(row.replacementInterval)),
    field("purchaseWarning", optionalCsv(row.purchaseWarning)),
    enumField("status", "PUBLISHED"),
    enumField(
      "verificationStatus",
      mapped(verificationMap, row.verificationStatus, "consumables.csv verificationStatus"),
    ),
    field("affiliateSearchKeyword", optionalCsv(row.affiliateSearchKeyword)),
    field("affiliateDirectUrl", optionalCsv(row.affiliateDirectUrl)),
    field("affiliateIsAffiliate", csvBoolean(row.affiliateIsAffiliate)),
    field("affiliateRestrictionNote", optionalCsv(row.affiliateRestrictionNote)),
    field("affiliateEnabled", csvBoolean(row.affiliateEnabled)),
    field("affiliateStatus", optionalCsv(row.affiliateStatus)),
    field("affiliatePriceStatus", optionalCsv(row.affiliatePriceStatus)),
    field("affiliateStockStatus", optionalCsv(row.affiliateStockStatus)),
    field("affiliateLinkCheckedAt", optionalCsv(row.affiliateLinkCheckedAt)),
    field("sortOrder", csvInteger(row.sortOrder)),
  ]),
);

const modelConsumableRows = modelConsumables.map((row) =>
  object([
    reference("model", row.modelId),
    reference("consumable", row.consumableId),
    enumField(
      "verificationStatus",
      mapped(verificationMap, row.verificationStatus, "model-consumables.csv verificationStatus"),
    ),
    field("verifiedAt", optionalCsv(row.verifiedAt)),
    field("note", optionalCsv(row.note)),
  ]),
);

const sourceRows = sources.map((row) =>
  object([
    field("id", row.id),
    field("title", row.title),
    field("url", row.url),
    enumField("sourceType", mapped(sourceTypeMap, row.sourceType, "sources.csv sourceType")),
    field("checkedAt", row.checkedAt),
    field("isActive", csvBoolean(row.isActive)),
  ]),
);

const relationRows = (entityType: string, relationName: string) =>
  entitySources
    .filter((row) => row.entityType === entityType)
    .map((row) =>
      object([
        reference(relationName, row.entityId),
        reference("source", row.sourceId),
        field("purpose", optionalCsv(row.purpose)),
      ]),
    );

const imageRows = images.map((row) =>
  object([
    field("id", row.id),
    reference("model", row.modelId),
    field("url", row.src),
    field("alt", row.alt),
    field("sourceUrl", row.sourceUrl),
    field("checkedAt", row.checkedAt),
    field("sortOrder", csvInteger(row.sortOrder)),
    field("isPrimary", csvBoolean(row.isPrimary)),
  ]),
);

const productOptionRows = productOptions.map((row) =>
  object([
    field("id", row.id),
    reference("consumable", row.consumableId),
    field("name", row.name),
    enumField("kind", mapped(optionKindMap, row.kind, "product-options.csv kind")),
    enumField(
      "verification",
      mapped(optionVerificationMap, row.verification, "product-options.csv verification"),
    ),
    field("description", row.description),
    field("partNumber", optionalCsv(row.partNumber)),
    field("packageLabel", optionalCsv(row.packageLabel)),
    field("sortOrder", csvInteger(row.sortOrder)),
    field("isActive", csvBoolean(row.isActive)),
  ]),
);

const purchaseLinkRows = purchaseLinks.map((row) =>
  object([
    field("id", row.id),
    reference("consumable", row.consumableId),
    row.productOptionId ? reference("productOption", row.productOptionId) : "productOption: null",
    field("label", row.label),
    field("url", row.url),
    enumField("channel", mapped(purchaseChannelMap, row.channel, "purchase-links.csv channel")),
    enumField("linkType", mapped(purchaseLinkTypeMap, row.linkType, "purchase-links.csv linkType")),
    field("isAffiliate", csvBoolean(row.isAffiliate)),
    field("checkedAt", row.checkedAt),
    field("isActive", csvBoolean(row.isActive)),
  ]),
);

const tables: Array<[string, CsvRow[] | string[]]> = [
  ["category", categoryRows],
  ["brand", brandRows],
  ["source", sourceRows],
  ["brandCategory", brandCategoryRows],
  ["model", modelRows],
  ["modelAlias", modelAliasRows],
  ["consumable", consumableRows],
  ["modelConsumable", modelConsumableRows],
  ["modelSource", relationRows("model", "model")],
  ["consumableSource", relationRows("consumable", "consumable")],
  ["modelImage", imageRows],
  ["productOption", productOptionRows],
  ["productOptionSource", relationRows("product-option", "productOption")],
  ["purchaseLink", purchaseLinkRows],
];

const blocks = [
  "# LOCAL ONLY: generated from private catalog CSV files.",
  "# Re-run `npm run database:import` after editing the catalog.",
  "# Idempotent upserts update matching keys and insert new records.",
  "mutation ImportCatalog @transaction {",
  ...tables
    .filter(([, rows]) => rows.length > 0)
    .map(
      ([table, rows]) =>
        `  ${table}_upsertMany(data: [\n    ${(rows as string[]).join(",\n    ")}\n  ])`,
    ),
  "}",
  "",
];

const formattedSeed = await prettier.format(blocks.join("\n"), { parser: "graphql" });
await writeFile(outputPath, formattedSeed, "utf8");
console.log(
  `SQL Connect 가져오기 파일 생성: ${tables.map(([name, rows]) => `${name} ${rows.length}`).join(", ")}`,
);
