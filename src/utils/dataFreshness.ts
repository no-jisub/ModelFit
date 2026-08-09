import type { ConsumableCompatibility } from "../types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const REVIEW_SOON_AFTER_DAYS = 90;
export const STALE_AFTER_DAYS = 180;

export type DataFreshnessStatus = "current" | "review-soon" | "stale" | "invalid";

export interface DataFreshness {
  status: DataFreshnessStatus;
  label: string;
  ageDays: number | null;
}

export function getDataFreshness(checkedAt: string, now = new Date()): DataFreshness {
  const checkedTime = Date.parse(checkedAt);
  if (Number.isNaN(checkedTime)) {
    return { status: "invalid", label: "확인일 오류", ageDays: null };
  }

  const ageDays = Math.max(0, Math.floor((now.getTime() - checkedTime) / DAY_IN_MS));
  if (ageDays > STALE_AFTER_DAYS) {
    return { status: "stale", label: "재확인 필요", ageDays };
  }
  if (ageDays > REVIEW_SOON_AFTER_DAYS) {
    return { status: "review-soon", label: "재확인 예정", ageDays };
  }
  return { status: "current", label: "최근 확인", ageDays };
}

export function getConsumableCheckedAt(part: ConsumableCompatibility) {
  const dates = [
    ...part.sources.map((source) => source.checkedAt),
    ...part.purchaseLinks.map((link) => link.checkedAt),
  ]
    .filter((date) => !Number.isNaN(Date.parse(date)))
    .sort((left, right) => Date.parse(left) - Date.parse(right));

  return dates[0] ?? "";
}
