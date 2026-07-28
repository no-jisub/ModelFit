import type { ConsumableType } from "@/types";
import type { ReplacementReminder } from "./applianceStorage";

export type ReminderState = "unset" | "ok" | "soon" | "overdue";

const defaultIntervals: Record<ConsumableType, number> = {
  "hepa-filter": 180,
  "deodorizing-filter": 180,
  "pre-filter": 90,
  "all-in-one-filter": 180,
  "dust-bin-filter": 90,
  "dust-bag": 60,
  "main-brush": 180,
  "side-brush": 180,
  "mop-pad": 90,
};

function asLocalDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export function getDefaultIntervalDays(type: ConsumableType): number {
  return defaultIntervals[type];
}

export function getLocalDateValue(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function getNextReplacementDate(reminder: ReplacementReminder): string {
  const next = asLocalDate(reminder.lastReplacedAt);
  next.setDate(next.getDate() + reminder.intervalDays);
  return getLocalDateValue(next);
}

export function getReminderState(
  reminder: ReplacementReminder | undefined,
  today = new Date(),
): ReminderState {
  if (!reminder) return "unset";

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const next = asLocalDate(getNextReplacementDate(reminder));
  const daysUntil = Math.ceil((next.getTime() - todayStart.getTime()) / 86_400_000);

  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 14) return "soon";
  return "ok";
}

export function formatKoreanDate(value: string): string {
  const date = asLocalDate(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}
