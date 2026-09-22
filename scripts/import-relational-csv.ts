import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

type Row = Record<string, string>;

const inputDirectory = path.resolve("data/catalog");
const outputPath = path.resolve("src/data/importedRelationalCatalog.ts");
const checkOnly = process.argv.includes("--check");

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
      } else if (character === '"') quoted = false;
      else field += character;
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

const readCsv = async (name: string): Promise<Row[]> => {
  const rows = parseRows(await readFile(path.join(inputDirectory, name), "utf8"));
  const headers = rows.shift() ?? [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
};

const split = (value: string) =>
  value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
const optional = (value: string) => value || undefined;
const boolean = (value: string) => value === "true";
const byOrder = (left: Row, right: Row) => Number(left.sortOrder) - Number(right.sortOrder);

const [
  categoryRows,
  brandRows,
  consumableRows,
  relationRows,
  sourceRows,
  entitySourceRows,
  optionRows,
  linkRows,
  imageRows,
] = await Promise.all([
  readCsv("categories.csv"),
  readCsv("brands.csv"),
  readCsv("consumables.csv"),
  readCsv("model-consumables.csv"),
  readCsv("sources.csv"),
  readCsv("entity-sources.csv"),
  readCsv("product-options.csv"),
  readCsv("purchase-links.csv"),
  readCsv("images.csv"),
]);

const sourcesById = new Map(
  sourceRows.map((row) => [
    row.id,
    { title: row.title, url: row.url, sourceType: row.sourceType, checkedAt: row.checkedAt },
  ]),
);
const sourceReferences = (entityType: string, entityId: string) =>
  entitySourceRows
    .filter((row) => row.entityType === entityType && row.entityId === entityId)
    .map((row) => sourcesById.get(row.sourceId))
    .filter((source) => source !== undefined);

const purchaseLink = (row: Row) => ({
  id: row.id,
  label: row.label,
  url: row.url,
  channel: row.channel,
  linkType: row.linkType,
  isAffiliate: boolean(row.isAffiliate),
  checkedAt: row.checkedAt,
});

const categories = categoryRows.sort(byOrder).map((row) => ({
  id: row.id,
  label: row.label,
  symbol: row.symbol,
  selectorImage: row.selectorImage,
  description: row.description,
  metaDescription: row.metaDescription,
  modelNumberGuide: row.modelNumberGuide,
  partTypes: split(row.partTypes),
}));

const brands = brandRows.sort(byOrder).map((row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  nameEn: optional(row.nameEn),
  supportedCategories: split(row.supportedCategories),
  officialDomains: split(row.officialDomains),
}));

const consumables = consumableRows.sort(byOrder).map((row) => {
  const productOptions = optionRows
    .filter((option) => option.consumableId === row.id && boolean(option.isActive))
    .sort(byOrder)
    .map((option) => ({
      id: option.id,
      name: option.name,
      kind: option.kind,
      verification: option.verification,
      description: option.description,
      partNumber: optional(option.partNumber),
      packageLabel: optional(option.packageLabel),
      sources: sourceReferences("product-option", option.id),
      purchaseLinks: linkRows
        .filter((link) => link.productOptionId === option.id && boolean(link.isActive))
        .map(purchaseLink),
    }));
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    displayName: row.displayName,
    genuinePartNumber: optional(row.genuinePartNumber),
    partNumberStatus: row.partNumberStatus,
    compatibleProductName: optional(row.compatibleProductName),
    compatibleModelIds: relationRows
      .filter((relation) => relation.consumableId === row.id)
      .map((relation) => relation.modelId),
    searchKeywords: split(row.searchKeywords),
    replacementInterval: optional(row.replacementInterval),
    purchaseWarning: optional(row.purchaseWarning),
    verificationStatus: row.verificationStatus,
    sources: sourceReferences("consumable", row.id),
    affiliate: {
      searchKeyword: row.affiliateSearchKeyword,
      directUrl: optional(row.affiliateDirectUrl),
      isAffiliate: boolean(row.affiliateIsAffiliate),
      restrictionNote: optional(row.affiliateRestrictionNote),
      enabled: boolean(row.affiliateEnabled),
      status: row.affiliateStatus,
      priceStatus: row.affiliatePriceStatus,
      stockStatus: row.affiliateStockStatus,
      linkCheckedAt: row.affiliateLinkCheckedAt,
    },
    purchaseLinks: linkRows
      .filter((link) => link.consumableId === row.id && boolean(link.isActive))
      .map(purchaseLink),
    productOptions,
  };
});

const modelImages = Object.fromEntries(
  imageRows
    .filter((row) => boolean(row.isPrimary))
    .sort(byOrder)
    .map((row) => [
      row.modelId,
      { src: row.src, alt: row.alt, sourceUrl: row.sourceUrl, checkedAt: row.checkedAt },
    ]),
);

const modelConsumableIds = Object.fromEntries(
  [...new Set(relationRows.map((row) => row.modelId))].map((modelId) => [
    modelId,
    relationRows.filter((row) => row.modelId === modelId).map((row) => row.consumableId),
  ]),
);

const source = `import type { Brand, ConsumableCompatibility, ModelImage } from "@/types";

/**
 * \`npm run catalog:import\`가 data/catalog의 관계형 CSV에서 생성합니다.
 * 이 파일을 직접 수정하지 마세요.
 */
export const relationalCategories = ${JSON.stringify(categories, null, 2)} as const;

export const relationalBrands: Brand[] = ${JSON.stringify(brands, null, 2)};

export const relationalConsumables: ConsumableCompatibility[] = ${JSON.stringify(consumables, null, 2)};

export const relationalModelImages: Record<string, ModelImage> = ${JSON.stringify(modelImages, null, 2)};

export const relationalModelConsumableIds: Record<string, string[]> = ${JSON.stringify(modelConsumableIds, null, 2)};
`;
const formatted = await prettier.format(source, { parser: "typescript", printWidth: 100 });

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== formatted) {
    console.error(
      "관계형 CSV와 생성된 사이트 데이터가 다릅니다. npm run catalog:import를 실행하세요.",
    );
    process.exit(1);
  }
  console.log("관계형 CSV와 사이트 생성 데이터가 일치합니다.");
} else {
  await writeFile(outputPath, formatted, "utf8");
  console.log(`사이트 관계형 데이터 생성 완료: ${path.relative(process.cwd(), outputPath)}`);
}
