import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";
import { getConsumableCheckedAt, getDataFreshness } from "../src/utils/dataFreshness";

const entries = [
  ...models.map((model) => ({ kind: "model", id: model.id, checkedAt: model.lastVerifiedAt })),
  ...consumables.map((part) => ({
    kind: "consumable",
    id: part.id,
    checkedAt: getConsumableCheckedAt(part),
  })),
].map((entry) => ({ ...entry, freshness: getDataFreshness(entry.checkedAt) }));

const counts = entries.reduce(
  (result, entry) => {
    result[entry.freshness.status] += 1;
    return result;
  },
  { current: 0, "review-soon": 0, stale: 0, invalid: 0 },
);

console.log(
  `데이터 신선도 감사: 전체 ${entries.length}, 최근 확인 ${counts.current}, 재확인 예정 ${counts["review-soon"]}, 재확인 필요 ${counts.stale}, 오류 ${counts.invalid}`,
);

for (const entry of entries.filter((item) => item.freshness.status !== "current")) {
  console.warn(
    `[${entry.freshness.status}] ${entry.kind} ${entry.id} · ${entry.checkedAt || "확인일 없음"}`,
  );
}

if (counts.stale > 0 || counts.invalid > 0) process.exitCode = 1;
