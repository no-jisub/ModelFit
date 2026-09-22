import { readFile } from "node:fs/promises";
import path from "node:path";
import { brands } from "../src/data/brands";
import { categories } from "../src/data/categories";
import { importedCatalogModels } from "../src/data/importedCatalogModels";
import { toModelId } from "../src/utils/modelSlug";

const root = process.cwd();
const [firebaseConfigText, serviceConfig, schema, queries, mutations, seed] = await Promise.all([
  readFile(path.join(root, "firebase.json"), "utf8"),
  readFile(path.join(root, "dataconnect/dataconnect.yaml"), "utf8"),
  readFile(path.join(root, "dataconnect/schema/schema.gql"), "utf8"),
  readFile(path.join(root, "dataconnect/catalog/queries.gql"), "utf8"),
  readFile(path.join(root, "dataconnect/catalog/mutations.gql"), "utf8"),
  readFile(path.join(root, "dataconnect/seed_data.gql"), "utf8"),
]);

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
  "ModelImage",
  "ProductOption",
  "PurchaseLink",
];
for (const table of expectedTables) {
  if (!new RegExp(`type\\s+${table}\\b`).test(schema)) errors.push(`스키마 테이블 누락: ${table}`);
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

for (const category of categories) {
  if (!seed.includes(`id: ${JSON.stringify(category.id)}`)) {
    errors.push(`시드 카테고리 누락: ${category.id}`);
  }
}
for (const brand of brands) {
  if (!seed.includes(`id: ${JSON.stringify(brand.id)}`))
    errors.push(`시드 브랜드 누락: ${brand.id}`);
}
for (const model of importedCatalogModels) {
  const id = toModelId(model.brandId, model.modelCode);
  if (!seed.includes(`id: ${JSON.stringify(id)}`)) errors.push(`시드 모델 누락: ${id}`);
}

if (errors.length) {
  console.error(`SQL Connect 로컬 검사 실패: ${errors.length}개 오류`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `SQL Connect 로컬 검사 통과: 테이블 ${expectedTables.length}, 공개 조회 ${publicOperations.length}, 관리자 변경 ${adminOperations.length}, 모델 시드 ${importedCatalogModels.length}`,
);
