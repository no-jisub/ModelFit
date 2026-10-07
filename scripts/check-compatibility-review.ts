import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { loadRawCatalog } from "./lib/catalog-schema";
import { applyCompatibilityReview, type CompatibilityDecision } from "./lib/compatibility-review";

const index = process.argv.indexOf("--before");
const backup = process.argv[index + 1];
if (index < 0 || !backup) throw new Error("--before 검토 이전 v2 백업 경로가 필요합니다.");
const before = await loadRawCatalog(path.join(backup, "data/catalog"));
const current = await loadRawCatalog();
const decisions = JSON.parse(
  await readFile("data/catalog/compatibility-review.json", "utf8"),
) as CompatibilityDecision[];
if (decisions.length !== before["model-consumables.csv"].length)
  throw new Error("전체 관계에 대한 검토 기록이 필요합니다.");
const expected = applyCompatibilityReview(before, decisions);
for (const file of Object.keys(expected) as (keyof typeof expected)[]) {
  const canonical = (rows: (typeof expected)[typeof file]) =>
    rows.map((row) => JSON.stringify(row)).sort();
  if (!isDeepStrictEqual(canonical(current[file]), canonical(expected[file])))
    throw new Error("검토 기록 외 변경이 발견되었습니다: " + file);
}
const report = {
  before: backup,
  relations: decisions.length,
  official: decisions.filter((d) => d.status === "official").length,
  unverified: decisions.filter((d) => d.status === "unverified").length,
  sourceJoins: current["compatibility-sources.csv"].length,
  preserved: "모델·부품·관계·상품·링크 ID와 URL, 구성·관리 정보 및 검토 외 모든 원본 필드",
};
await mkdir("outputs/compatibility", { recursive: true });
await writeFile("outputs/compatibility/preservation.json", JSON.stringify(report, null, 2) + "\n");
console.log(
  `호환 검토 보존 검사 통과: ${report.relations}개 관계, 공식 ${report.official}, 미확인 ${report.unverified}, 근거 연결 ${report.sourceJoins}`,
);
