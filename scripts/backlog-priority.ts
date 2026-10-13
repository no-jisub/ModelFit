import { readFile, mkdir, writeFile } from "node:fs/promises";
import { loadRawCatalog } from "./lib/catalog-schema";
import { prioritizeBacklog, type ModelDemand } from "./lib/backlog-priority";
const index = process.argv.indexOf("--from");
let demand: ModelDemand[] = [];
let dataKind = "catalog-only";
let noResultTerms: unknown[] = [];
if (index >= 0) {
  if (!process.argv[index + 1]) throw new Error("--from 분석 보고서 경로가 필요합니다.");
  const report = JSON.parse(await readFile(process.argv[index + 1], "utf8"));
  if (report.dataKind !== "provided-events")
    throw new Error(
      "실제 입력 이벤트 보고서만 작업 우선순위에 사용할 수 있습니다. 테스트 데이터는 제외됩니다.",
    );
  if (
    !Array.isArray(report.byModel) ||
    report.byModel.some(
      (r: ModelDemand) =>
        typeof r.modelId !== "string" ||
        !Number.isInteger(r.pageViews) ||
        r.pageViews < 0 ||
        !Number.isInteger(r.purchaseClicks) ||
        r.purchaseClicks < 0,
    )
  )
    throw new Error("모델별 이벤트 집계가 올바르지 않습니다.");
  demand = report.byModel;
  dataKind = "provided-events";
  noResultTerms = report.noResultTerms ?? [];
}
const report = {
  dataKind,
  note: demand.length
    ? "입력된 클릭·조회 이벤트 횟수에 따른 순서이며 사용자 수·주문 수가 아닙니다."
    : "실제 이용 데이터가 없어 카탈로그 상태 기준의 임시 순서입니다. 인기·수요 순위가 아닙니다.",
  ordering: [
    "구매 클릭 횟수",
    "모델 조회 횟수",
    "구매 링크가 있는 미검증 연결 수",
    "공식 확인 후 구매처 없는 연결 수",
    "구매처 없는 미검증 연결 수",
    "모델번호",
  ],
  models: prioritizeBacklog(await loadRawCatalog(), demand),
  noResultTerms,
};
await mkdir("outputs/analytics", { recursive: true });
await writeFile("outputs/analytics/backlog-priority.json", JSON.stringify(report, null, 2) + "\n");
console.log(
  `작업 우선순위 ${report.models.length}개 모델 (${dataKind}): outputs/analytics/backlog-priority.json`,
);
