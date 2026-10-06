import { readFile, mkdir, writeFile } from "node:fs/promises";
import { summarizeAnalytics } from "./lib/analytics-report";
import type { AnalyticsQueueItem } from "../src/utils/analytics";

const index = process.argv.indexOf("--from");
if (index < 0 || !process.argv[index + 1])
  throw new Error("사용법: npm run analytics:report -- --from 이벤트.json [--test-data]");
const input: unknown = JSON.parse(await readFile(process.argv[index + 1], "utf8"));
if (
  !Array.isArray(input) ||
  input.some(
    (event) =>
      !event ||
      typeof event.name !== "string" ||
      !event.params ||
      typeof event.params !== "object" ||
      Array.isArray(event.params) ||
      typeof event.createdAt !== "string",
  )
)
  throw new Error("브라우저 이벤트 배열 형식이 아닙니다.");
const report = {
  dataKind: process.argv.includes("--test-data") ? "test-data" : "provided-events",
  note: "입력 이벤트 횟수이며 고유 사용자·세션 전환율이나 주문 완료 수가 아닙니다. 브라우저 큐는 현재 페이지의 최근 200건만 보관합니다.",
  ...summarizeAnalytics(input as AnalyticsQueueItem[]),
};
await mkdir("outputs/analytics", { recursive: true });
await writeFile("outputs/analytics/report.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
