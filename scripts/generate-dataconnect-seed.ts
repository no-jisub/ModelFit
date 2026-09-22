import { writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { brands } from "../src/data/brands";
import { categories } from "../src/data/categories";
import { importedCatalogModels } from "../src/data/importedCatalogModels";
import { toModelId, toModelSlug } from "../src/utils/modelSlug";

const outputPath = path.resolve("dataconnect/seed_data.gql");
const quote = (value: string) => JSON.stringify(value);
const field = (name: string, value: string | number | boolean | undefined) => {
  if (value === undefined || value === "") return null;
  return `${name}: ${typeof value === "string" ? quote(value) : String(value)}`;
};
const object = (fields: Array<string | null>) => `{ ${fields.filter(Boolean).join(", ")} }`;

function releaseParts(value?: string) {
  if (!value) return {};
  const [year, month, day] = value.split("-").map(Number);
  return { releaseYear: year, releaseMonth: month, releaseDay: day };
}

const categoryRows = categories.map((category, index) =>
  object([
    field("id", category.id),
    field("slug", category.id),
    field("label", category.label),
    field("description", category.description),
    field("modelNumberGuide", category.modelNumberGuide),
    field("sortOrder", index),
    field("isActive", true),
  ]),
);

const brandRows = brands.map((brand, index) =>
  object([
    field("id", brand.id),
    field("slug", brand.slug),
    field("name", brand.name),
    field("nameEn", brand.nameEn),
    `officialDomains: [${brand.officialDomains.map(quote).join(", ")}]`,
    field("sortOrder", index),
    field("isActive", true),
  ]),
);

const brandCategoryRows = brands.flatMap((brand) =>
  brand.supportedCategories.map((categoryId) =>
    object([`brand: { id: ${quote(brand.id)} }`, `category: { id: ${quote(categoryId)} }`]),
  ),
);

const sourceTypeMap = {
  manufacturer: "MANUFACTURER",
  "official-manual": "OFFICIAL_MANUAL",
  "official-store": "OFFICIAL_STORE",
  seller: "SELLER",
  other: "OTHER",
} as const;

const modelRows = importedCatalogModels.map((model) => {
  const release = releaseParts(model.releaseDate);
  return object([
    field("id", toModelId(model.brandId, model.modelCode)),
    field("slug", toModelSlug(model.modelCode)),
    `category: { id: ${quote(model.category)} }`,
    `brand: { id: ${quote(model.brandId)} }`,
    field("modelName", model.modelName),
    field("modelCode", model.modelCode),
    field("modelCodeNormalized", model.modelCode.toLowerCase().replace(/[\s-]/g, "")),
    field("series", model.series),
    "status: PUBLISHED",
    "verificationStatus: OFFICIAL",
    field("sourceUrl", model.sourceUrl),
    field("sourceTitle", model.sourceTitle),
    `sourceType: ${sourceTypeMap[model.sourceType]}`,
    field("verifiedAt", model.verifiedAt),
    field("releaseYear", release.releaseYear),
    field("releaseMonth", release.releaseMonth),
    field("releaseDay", release.releaseDay),
    field("releaseSourceUrl", model.releaseSourceUrl),
  ]);
});

const aliasRows = importedCatalogModels.flatMap((model) =>
  (model.aliases ?? []).map((alias) =>
    object([
      `model: { id: ${quote(toModelId(model.brandId, model.modelCode))} }`,
      field("alias", alias),
      field("aliasNormalized", alias.toLowerCase().replace(/[\s-]/g, "")),
    ]),
  ),
);

const blocks = [
  "# LOCAL ONLY: generated from the checked-in catalog CSV.",
  "# Run `npm run database:seed` after changing categories, brands, or models.csv.",
  "mutation SeedCatalog @transaction {",
  `  category_insertMany(data: [\n    ${categoryRows.join(",\n    ")}\n  ])`,
  `  brand_insertMany(data: [\n    ${brandRows.join(",\n    ")}\n  ])`,
  `  brandCategory_insertMany(data: [\n    ${brandCategoryRows.join(",\n    ")}\n  ])`,
  `  model_insertMany(data: [\n    ${modelRows.join(",\n    ")}\n  ])`,
  ...(aliasRows.length
    ? [`  modelAlias_insertMany(data: [\n    ${aliasRows.join(",\n    ")}\n  ])`]
    : []),
  "}",
  "",
];

const formattedSeed = await prettier.format(blocks.join("\n"), { parser: "graphql" });
await writeFile(outputPath, formattedSeed, "utf8");
console.log(
  `SQL Connect seed 생성: 카테고리 ${categoryRows.length}, 브랜드 ${brandRows.length}, 모델 ${modelRows.length}, 별칭 ${aliasRows.length}`,
);
