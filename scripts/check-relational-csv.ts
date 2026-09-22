import { readFile } from "node:fs/promises";
import path from "node:path";
import { brands } from "../src/data/brands";
import { categories } from "../src/data/categories";
import { consumables } from "../src/data/consumables";
import { modelImages } from "../src/data/modelImages";
import { parseModelCsv, validateModelCsv } from "../src/utils/catalogCsv";
import { toModelId } from "../src/utils/modelSlug";

type Row = Record<string, string>;

const inputDirectory = path.resolve("data/catalog");
const errors: string[] = [];
const sourceOnly = process.argv.includes("--source-only");

const parseRows = (input: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const text = input.replace(/^\uFEFF/, "");

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (quoted) throw new Error("닫히지 않은 큰따옴표가 있습니다.");
  if (field || row.length) {
    row.push(field);
    if (row.some(Boolean)) rows.push(row);
  }
  return rows;
};

const readCsv = async (name: string, expectedHeaders: string[]): Promise<Row[]> => {
  const input = await readFile(path.join(inputDirectory, name), "utf8");
  if (!input.startsWith("\uFEFF")) errors.push(`${name}: Excel 호환 UTF-8 BOM이 없습니다.`);
  const rows = parseRows(input);
  const headers = rows.shift() ?? [];
  if (headers.join("|") !== expectedHeaders.join("|"))
    errors.push(`${name}: 헤더가 정의와 다릅니다.`);
  return rows.map((values, index) => {
    if (values.length !== headers.length) {
      errors.push(`${name} ${index + 2}행: 열 개수가 ${headers.length}개가 아닙니다.`);
    }
    return Object.fromEntries(headers.map((header, column) => [header, values[column] ?? ""]));
  });
};

const unique = (name: string, rows: Row[], key: (row: Row) => string) => {
  const seen = new Set<string>();
  for (const [index, row] of rows.entries()) {
    const value = key(row);
    if (!value) errors.push(`${name} ${index + 2}행: 기본키가 비어 있습니다.`);
    else if (seen.has(value)) errors.push(`${name} ${index + 2}행: 기본키가 중복됩니다: ${value}`);
    seen.add(value);
  }
  return seen;
};

const requireReference = (
  file: string,
  rows: Row[],
  field: string,
  targets: Set<string>,
  allowEmpty = false,
) => {
  for (const [index, row] of rows.entries()) {
    const value = row[field];
    if (!value && allowEmpty) continue;
    if (!targets.has(value)) errors.push(`${file} ${index + 2}행: ${field} 참조 없음: ${value}`);
  }
};

const requireHttps = (file: string, rows: Row[], field: string) => {
  for (const [index, row] of rows.entries()) {
    if (!row[field]?.startsWith("https://")) {
      errors.push(`${file} ${index + 2}행: ${field}는 https 주소여야 합니다.`);
    }
  }
};

const requireFields = (file: string, rows: Row[], fields: string[]) => {
  for (const [index, row] of rows.entries()) {
    for (const field of fields) {
      if (!row[field]?.trim()) errors.push(`${file} ${index + 2}행: ${field} 값이 필요합니다.`);
    }
  }
};

const requireAllowedValues = (
  file: string,
  rows: Row[],
  field: string,
  allowed: readonly string[],
) => {
  for (const [index, row] of rows.entries()) {
    if (row[field] && !allowed.includes(row[field])) {
      errors.push(`${file} ${index + 2}행: ${field} 값이 올바르지 않습니다: ${row[field]}`);
    }
  }
};

const requireBoolean = (file: string, rows: Row[], fields: string[]) => {
  for (const field of fields) requireAllowedValues(file, rows, field, ["true", "false"]);
};

const requireNonNegativeInteger = (file: string, rows: Row[], field: string) => {
  for (const [index, row] of rows.entries()) {
    if (!/^\d+$/.test(row[field] ?? "")) {
      errors.push(`${file} ${index + 2}행: ${field}는 0 이상의 정수여야 합니다.`);
    }
  }
};

const requireIsoDate = (file: string, rows: Row[], field: string, allowEmpty = false) => {
  for (const [index, row] of rows.entries()) {
    const value = row[field];
    if (!value && allowEmpty) continue;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
    const date = match
      ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
      : undefined;
    if (
      !match ||
      !date ||
      date.getUTCFullYear() !== Number(match[1]) ||
      date.getUTCMonth() !== Number(match[2]) - 1 ||
      date.getUTCDate() !== Number(match[3])
    ) {
      errors.push(`${file} ${index + 2}행: ${field}는 YYYY-MM-DD 형식이어야 합니다.`);
    }
  }
};
const categoriesCsv = await readCsv("categories.csv", [
  "id",
  "slug",
  "label",
  "symbol",
  "selectorImage",
  "description",
  "metaDescription",
  "modelNumberGuide",
  "partTypes",
  "sortOrder",
  "isActive",
]);
const brandsCsv = await readCsv("brands.csv", [
  "id",
  "slug",
  "name",
  "nameEn",
  "supportedCategories",
  "officialDomains",
  "sortOrder",
  "isActive",
]);
const consumablesCsv = await readCsv("consumables.csv", [
  "id",
  "slug",
  "type",
  "displayName",
  "genuinePartNumber",
  "partNumberStatus",
  "compatibleProductName",
  "searchKeywords",
  "replacementInterval",
  "purchaseWarning",
  "verificationStatus",
  "affiliateSearchKeyword",
  "affiliateDirectUrl",
  "affiliateIsAffiliate",
  "affiliateRestrictionNote",
  "affiliateEnabled",
  "affiliateStatus",
  "affiliatePriceStatus",
  "affiliateStockStatus",
  "affiliateLinkCheckedAt",
  "sortOrder",
]);
const modelConsumablesCsv = await readCsv("model-consumables.csv", [
  "modelId",
  "consumableId",
  "verificationStatus",
  "verifiedAt",
  "note",
]);
const sourcesCsv = await readCsv("sources.csv", [
  "id",
  "title",
  "url",
  "sourceType",
  "checkedAt",
  "isActive",
]);
const entitySourcesCsv = await readCsv("entity-sources.csv", [
  "entityType",
  "entityId",
  "sourceId",
  "purpose",
]);
const productOptionsCsv = await readCsv("product-options.csv", [
  "id",
  "consumableId",
  "name",
  "kind",
  "verification",
  "description",
  "partNumber",
  "packageLabel",
  "sortOrder",
  "isActive",
]);
const purchaseLinksCsv = await readCsv("purchase-links.csv", [
  "id",
  "consumableId",
  "productOptionId",
  "label",
  "url",
  "channel",
  "linkType",
  "isAffiliate",
  "checkedAt",
  "isActive",
]);
const imagesCsv = await readCsv("images.csv", [
  "id",
  "modelId",
  "src",
  "alt",
  "sourceUrl",
  "checkedAt",
  "sortOrder",
  "isPrimary",
]);

requireFields("categories.csv", categoriesCsv, ["id", "slug", "label", "sortOrder", "isActive"]);
requireFields("brands.csv", brandsCsv, [
  "id",
  "slug",
  "name",
  "supportedCategories",
  "sortOrder",
  "isActive",
]);
requireFields("consumables.csv", consumablesCsv, [
  "id",
  "slug",
  "type",
  "displayName",
  "partNumberStatus",
  "verificationStatus",
  "sortOrder",
]);
requireFields("model-consumables.csv", modelConsumablesCsv, [
  "modelId",
  "consumableId",
  "verificationStatus",
  "verifiedAt",
]);
requireFields("sources.csv", sourcesCsv, [
  "id",
  "title",
  "url",
  "sourceType",
  "checkedAt",
  "isActive",
]);
requireFields("entity-sources.csv", entitySourcesCsv, [
  "entityType",
  "entityId",
  "sourceId",
  "purpose",
]);
requireFields("product-options.csv", productOptionsCsv, [
  "id",
  "consumableId",
  "name",
  "kind",
  "verification",
  "sortOrder",
  "isActive",
]);
requireFields("purchase-links.csv", purchaseLinksCsv, [
  "id",
  "consumableId",
  "label",
  "url",
  "channel",
  "linkType",
  "isAffiliate",
  "checkedAt",
  "isActive",
]);
requireFields("images.csv", imagesCsv, [
  "id",
  "modelId",
  "src",
  "alt",
  "sourceUrl",
  "checkedAt",
  "sortOrder",
  "isPrimary",
]);
requireBoolean("categories.csv", categoriesCsv, ["isActive"]);
requireBoolean("brands.csv", brandsCsv, ["isActive"]);
requireBoolean("consumables.csv", consumablesCsv, ["affiliateIsAffiliate", "affiliateEnabled"]);
requireBoolean("sources.csv", sourcesCsv, ["isActive"]);
requireBoolean("product-options.csv", productOptionsCsv, ["isActive"]);
requireBoolean("purchase-links.csv", purchaseLinksCsv, ["isAffiliate", "isActive"]);
requireBoolean("images.csv", imagesCsv, ["isPrimary"]);
for (const [file, rows] of [
  ["categories.csv", categoriesCsv],
  ["brands.csv", brandsCsv],
  ["consumables.csv", consumablesCsv],
  ["product-options.csv", productOptionsCsv],
  ["images.csv", imagesCsv],
] as const) {
  requireNonNegativeInteger(file, rows, "sortOrder");
}
requireIsoDate("model-consumables.csv", modelConsumablesCsv, "verifiedAt");
requireIsoDate("sources.csv", sourcesCsv, "checkedAt");
requireIsoDate("purchase-links.csv", purchaseLinksCsv, "checkedAt");
requireIsoDate("images.csv", imagesCsv, "checkedAt");
requireIsoDate("consumables.csv", consumablesCsv, "affiliateLinkCheckedAt", true);
requireAllowedValues("sources.csv", sourcesCsv, "sourceType", [
  "manufacturer",
  "official-manual",
  "official-store",
  "seller",
  "other",
]);
requireAllowedValues("entity-sources.csv", entitySourcesCsv, "entityType", [
  "model",
  "consumable",
  "product-option",
]);
requireAllowedValues("product-options.csv", productOptionsCsv, "kind", ["genuine", "compatible"]);
requireAllowedValues("purchase-links.csv", purchaseLinksCsv, "channel", [
  "coupang",
  "official",
  "other",
]);
requireAllowedValues("purchase-links.csv", purchaseLinksCsv, "linkType", [
  "direct-product",
  "official-reference",
]);
const categoryIds = unique("categories.csv", categoriesCsv, (row) => row.id);
unique("categories.csv", categoriesCsv, (row) => `slug:${row.slug}`);
const brandIds = unique("brands.csv", brandsCsv, (row) => row.id);
unique("brands.csv", brandsCsv, (row) => `slug:${row.slug}`);
const consumableIds = unique("consumables.csv", consumablesCsv, (row) => row.id);
unique("consumables.csv", consumablesCsv, (row) => `slug:${row.slug}`);
const sourceIds = unique("sources.csv", sourcesCsv, (row) => row.id);
const productOptionIds = unique("product-options.csv", productOptionsCsv, (row) => row.id);
unique("purchase-links.csv", purchaseLinksCsv, (row) => row.id);
unique("images.csv", imagesCsv, (row) => row.id);
unique("model-consumables.csv", modelConsumablesCsv, (row) => `${row.modelId}|${row.consumableId}`);
unique(
  "entity-sources.csv",
  entitySourcesCsv,
  (row) => `${row.entityType}|${row.entityId}|${row.sourceId}`,
);

const modelRecords = parseModelCsv(await readFile(path.resolve("data/import/models.csv"), "utf8"));
const modelValidation = validateModelCsv(modelRecords, {
  categoryIds,
  brandCategories: new Map(
    brandsCsv.map((brand) => [
      brand.id,
      new Set(brand.supportedCategories.split("|").filter(Boolean)),
    ]),
  ),
  existingModelIds: new Set(),
  existingModelCodes: new Set(),
});
for (const error of modelValidation.errors) errors.push(`models.csv ${error}`);
const modelIds = new Set(
  modelValidation.entries.map((entry) => toModelId(entry.brandId, entry.modelCode)),
);
for (const [index, brand] of brandsCsv.entries()) {
  for (const categoryId of brand.supportedCategories.split("|").filter(Boolean)) {
    if (!categoryIds.has(categoryId))
      errors.push(`brands.csv ${index + 2}행: 지원 카테고리 없음: ${categoryId}`);
  }
}
requireReference("model-consumables.csv", modelConsumablesCsv, "modelId", modelIds);
requireReference("model-consumables.csv", modelConsumablesCsv, "consumableId", consumableIds);
requireReference("product-options.csv", productOptionsCsv, "consumableId", consumableIds);
requireReference("purchase-links.csv", purchaseLinksCsv, "consumableId", consumableIds);
requireReference("purchase-links.csv", purchaseLinksCsv, "productOptionId", productOptionIds, true);
requireReference("images.csv", imagesCsv, "modelId", modelIds);
requireReference("entity-sources.csv", entitySourcesCsv, "sourceId", sourceIds);
requireHttps("sources.csv", sourcesCsv, "url");
requireHttps("purchase-links.csv", purchaseLinksCsv, "url");
requireHttps("images.csv", imagesCsv, "sourceUrl");

for (const [index, link] of purchaseLinksCsv.entries()) {
  if (!link.productOptionId) continue;
  const option = productOptionsCsv.find(({ id }) => id === link.productOptionId);
  if (option && option.consumableId !== link.consumableId) {
    errors.push(`purchase-links.csv ${index + 2}행: 옵션과 소모품 연결이 다릅니다.`);
  }
}

const entities = { model: modelIds, consumable: consumableIds, "product-option": productOptionIds };
for (const [index, relation] of entitySourcesCsv.entries()) {
  const targets = entities[relation.entityType as keyof typeof entities];
  if (!targets) errors.push(`entity-sources.csv ${index + 2}행: 알 수 없는 entityType입니다.`);
  else if (!targets.has(relation.entityId))
    errors.push(`entity-sources.csv ${index + 2}행: entityId 참조 없음.`);
}

if (!sourceOnly) {
  const expectedCounts = new Map<string, [number, number]>([
    ["카테고리", [categoriesCsv.length, categories.length]],
    ["브랜드", [brandsCsv.length, brands.length]],
    ["소모품", [consumablesCsv.length, consumables.length]],
    [
      "호환 관계",
      [
        modelConsumablesCsv.length,
        consumables.reduce((sum, part) => sum + part.compatibleModelIds.length, 0),
      ],
    ],
    [
      "제품 옵션",
      [
        productOptionsCsv.length,
        consumables.reduce((sum, part) => sum + part.productOptions.length, 0),
      ],
    ],
    [
      "구매 링크",
      [
        purchaseLinksCsv.length,
        new Set(
          consumables.flatMap((part) => [
            ...part.purchaseLinks.map(({ id }) => id),
            ...part.productOptions.flatMap((option) => option.purchaseLinks.map(({ id }) => id)),
          ]),
        ).size,
      ],
    ],
    ["이미지", [imagesCsv.length, Object.keys(modelImages).length]],
  ]);
  for (const [label, [actual, expected]] of expectedCounts) {
    if (actual !== expected) errors.push(`${label} 행 수 불일치: CSV ${actual}, 기존 ${expected}`);
  }
  if (categoryIds.size !== categories.length || brandIds.size !== brands.length) {
    errors.push("카테고리 또는 브랜드 ID 개수가 기존 데이터와 다릅니다.");
  }
}

if (errors.length) {
  console.error(`관계형 CSV 검사 실패: ${errors.length}개 오류`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `관계형 CSV 검사 통과: 카테고리 ${categoriesCsv.length}, 브랜드 ${brandsCsv.length}, 모델 ${modelIds.size}, 소모품 ${consumablesCsv.length}, 호환 관계 ${modelConsumablesCsv.length}, 출처 ${sourcesCsv.length}, 제품 옵션 ${productOptionsCsv.length}, 구매 링크 ${purchaseLinksCsv.length}, 이미지 ${imagesCsv.length}`,
);
