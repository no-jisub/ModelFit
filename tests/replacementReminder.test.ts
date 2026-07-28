import { describe, expect, it } from "vitest";
import {
  getDefaultIntervalDays,
  getLocalDateValue,
  getNextReplacementDate,
  getReminderState,
} from "../src/utils/replacementReminder";

describe("교체 알림", () => {
  const reminder = {
    partId: "filter-a",
    lastReplacedAt: "2026-01-01",
    intervalDays: 180,
  };

  it("소모품 유형에 따라 보수적인 기본 주기를 제공한다", () => {
    expect(getDefaultIntervalDays("dust-bag")).toBe(60);
    expect(getDefaultIntervalDays("all-in-one-filter")).toBe(180);
  });

  it("마지막 교체일과 주기로 다음 교체일을 계산한다", () => {
    expect(getLocalDateValue(new Date(2026, 6, 29, 23, 30))).toBe("2026-07-29");
    expect(getNextReplacementDate(reminder)).toBe("2026-06-30");
  });

  it("다음 교체일까지 남은 기간으로 상태를 구분한다", () => {
    expect(getReminderState(undefined, new Date(2026, 5, 1))).toBe("unset");
    expect(getReminderState(reminder, new Date(2026, 5, 1))).toBe("ok");
    expect(getReminderState(reminder, new Date(2026, 5, 20))).toBe("soon");
    expect(getReminderState(reminder, new Date(2026, 6, 1))).toBe("overdue");
  });
});
