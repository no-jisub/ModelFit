import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseModelCsv } from "../src/utils/catalogCsv";
import { toModelId } from "../src/utils/modelSlug";
import { readCatalogCsv, splitList } from "./lib/catalog-csv";

const root = process.cwd();
const [firebaseConfigText, serviceConfig, schema, queries, mutations, seed] = await Promise.all([
  readFile(path.join(root, "firebase.json"), "utf8"),
  readFile(path.join(root, "dataconnect/dataconnect.yaml"), "utf8"),
  readFile(path.join(root, "dataconnect/schema/schema.gql"), "utf8"),
  readFile(path.join(root, "dataconnect/catalog/queries.gql"), "utf8"),
  readFile(path.join(root, "dataconnect/catalog/mutations.gql"), "utf8"),
  readFile(path.join(root, "dataconnect/seed_data.gql"), "utf8"),
]);
const [categories, brands, consumables, relations, sources, entitySources, options, links, images] =
  await Promise.all([
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
const modelRecords = parseModelCsv(
  await readFile(path.join(root, "data/import/models.csv"), "utf8"),
);

const errors: string[] = [];
const firebaseConfig = JSON.parse(firebaseConfigText) as {
  dataconnect?: { source?: string };
  emulators?: { dataconnect?: { port?: number } };
};
if (firebaseConfig.dataconnect?.source !== "dataconnect") {
  errors.push("firebase.json의 dataconnect.source가 dataconnect가 아닙니다.");
}
if (firebaseConfig.emulators?.dataconnect?.port !== 9399) {
  errors.push("SQL Connect 에뮬레이터 포트가 9399가 아닙니다.");
}
for (const required of [
  'serviceId: "modelfit-catalog"',
  'location: "asia-northeast3"',
  'database: "modelfit_catalog"',
  'instanceId: "modelfit-catalog"',
  'schemaValidation: "COMPATIBLE"',
]) {
  if (!serviceConfig.includes(required)) errors.push(`dataconnect.yaml 누락: ${required}`);
}

const expectedTables = [
  "Category",
  "Brand",
  "BrandCategory",
  "Model",
  "ModelAlias",
  "Consumable",
  "ModelConsumable",
  "Source",
  "ModelSource",
  "ConsumableSource",
  "ProductOptionSource",
  "ModelImage",
  "ProductOption",
  "PurchaseLink",
];
for (const table of expectedTables) {
  if (!new RegExp(`type\\s+${table}\\b`).test(schema)) errors.push(`스키마 테이블 누락: ${table}`);
  const fieldName = `${table[0].toLowerCase()}${table.slice(1)}_upsertMany`;
  if (!seed.includes(fieldName) && table !== "ModelAlias") {
    errors.push(`가져오기 upsert 누락: ${fieldName}`);
  }
}

const publicOperations = [...queries.matchAll(/query\s+(\w+)[\s\S]*?(?=\{)/g)];
for (const operation of publicOperations) {
  if (!operation[0].includes("@auth(level: PUBLIC")) {
    errors.push(`공개 조회 권한 누락: ${operation[1]}`);
  }
}
const adminOperations = [...mutations.matchAll(/mutation\s+(\w+)[\s\S]*?(?=\{)/g)];
for (const operation of adminOperations) {
  if (!operation[0].includes("auth.token.admin == true")) {
    errors.push(`관리자 권한 누락: ${operation[1]}`);
  }
}
if (seed.includes("@auth")) errors.push("로컬 seed_data.gql에는 @auth를 선언하면 안 됩니다.");
if (seed.includes("_insertMany"))
  errors.push("시드는 재실행 가능한 _upsertMany만 사용해야 합니다.");

const requireSeedIds = (label: string, rows: Array<Record<string, string>>) => {
  for (const row of rows) {
    if (!seed.includes(`id: ${JSON.stringify(row.id)}`))
      errors.push(`시드 ${label} 누락: ${row.id}`);
  }
};
requireSeedIds("카테고리", categories);
requireSeedIds("브랜드", brands);
requireSeedIds("소모품", consumables);
requireSeedIds("출처", sources);
requireSeedIds("제품 옵션", options);
requireSeedIds("구매 링크", links);
requireSeedIds("이미지", images);
for (const { values } of modelRecords) {
  const id = toModelId(values.brandId, values.modelCode);
  if (!seed.includes(`id: ${JSON.stringify(id)}`)) errors.push(`시드 모델 누락: ${id}`);
}

if (errors.length) {
  console.error(`SQL Connect 로컬 검사 실패: ${errors.length}개 오류`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const counts = {
  categories: categories.length,
  brands: brands.length,
  brandCategories: brands.reduce(
    (total, brand) => total + splitList(brand.supportedCategories).length,
    0,
  ),
  models: modelRecords.length,
  aliases: modelRecords.reduce(
    (total, record) => total + splitList(record.values.aliases).length,
    0,
  ),
  consumables: consumables.length,
  relations: relations.length,
  sources: sources.length,
  entitySources: entitySources.length,
  options: options.length,
  links: links.length,
  images: images.length,
};
console.log(
  `SQL Connect 로컬 검사 통과: 테이블 ${expectedTables.length}, 공개 조회 ${publicOperations.length}, 관리자 변경 ${adminOperations.length}, ` +
    Object.entries(counts)
      .map(([name, count]) => `${name} ${count}`)
      .join(", "),
);
