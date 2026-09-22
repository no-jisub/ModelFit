import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { brands } from "../src/data/brands";
import { categoryIds } from "../src/data/categories";
import { modelConsumableIds } from "../src/data/compatibilityMap";
import { importedCatalogModels } from "../src/data/importedCatalogModels";
import { modelImages } from "../src/data/modelImages";
import { models } from "../src/data/models";
import { parseModelCsv, validateModelCsv } from "../src/utils/catalogCsv";
import { toModelId } from "../src/utils/modelSlug";

const defaultInputPath = path.resolve("data/import/models.csv");
const outputPath = path.resolve("src/data/importedCatalogModels.ts");
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const fileFlagIndex = args.indexOf("--file");
const inlineFileFlag = args.find((value) => value.startsWith("--file="));
const inputPath = path.resolve(
  inlineFileFlag?.slice("--file=".length) ||
    (fileFlagIndex >= 0 ? (args[fileFlagIndex + 1] ?? "") : "") ||
    defaultInputPath,
);

const normalizeModelCode = (value: string) => value.toLowerCase().replace(/[\s-]/g, "");
const previousImportedIds = new Set(
  importedCatalogModels.map((entry) => toModelId(entry.brandId, entry.modelCode)),
);
const manuallyManagedModels = models.filter((model) => !previousImportedIds.has(model.id));

let records;
try {
  records = parseModelCsv(await readFile(inputPath, "utf8"));
} catch (error) {
  console.error(`CSV 읽기 실패: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const result = validateModelCsv(records, {
  categoryIds: new Set(categoryIds),
  brandCategories: new Map(
    brands.map((brand) => [brand.id, new Set<string>(brand.supportedCategories)]),
  ),
  existingModelIds: new Set(manuallyManagedModels.map(({ id }) => id)),
  existingModelCodes: new Set(
    manuallyManagedModels.map(({ modelCode }) => normalizeModelCode(modelCode)),
  ),
});

if (result.errors.length > 0) {
  console.error(`CSV 검증 실패: ${result.errors.length}개 오류`);
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}

const importedIds = result.entries.map((entry) => toModelId(entry.brandId, entry.modelCode));
const missingImageIds = importedIds.filter((id) => !modelImages[id]);
const missingConsumableIds = importedIds.filter((id) => !(modelConsumableIds[id]?.length > 0));

console.log(
  `CSV 검증 통과: 전체 ${records.length}행, 게시 ${result.publishedCount}행, 초안 ${result.draftCount}행`,
);
if (missingImageIds.length > 0) console.log(`이미지 연결 필요: ${missingImageIds.join(", ")}`);
if (missingConsumableIds.length > 0) {
  console.log(`소모품 연결 필요: ${missingConsumableIds.join(", ")}`);
}

if (checkOnly) {
  console.log("--check 모드: 사이트 데이터 파일은 변경하지 않았습니다.");
  process.exit(0);
}

const generatedSource = `import type { ImportedCatalogEntry } from "@/types";

/**
 * \`npm run import:models\`가 data/import/models.csv에서 생성합니다.
 * 이 파일을 직접 수정하지 마세요.
 */
export const importedCatalogModels: ImportedCatalogEntry[] = ${JSON.stringify(result.entries, null, 2)};
`;
const formattedSource = await prettier.format(generatedSource, {
  parser: "typescript",
  printWidth: 100,
});
await writeFile(outputPath, formattedSource, "utf8");
console.log(`사이트 모델 데이터 생성 완료: ${path.relative(process.cwd(), outputPath)}`);
