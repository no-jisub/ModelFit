import { brands } from "../src/data/brands";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import { validateData } from "../src/utils/validateData";

const result = validateData(brands, models, consumables);

for (const warning of result.warnings) {
  console.warn(`경고: ${warning}`);
}

if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`오류: ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `데이터 검증 통과: 브랜드 ${brands.length}, 모델 ${models.length}, 소모품 ${consumables.length}`,
  );
}
