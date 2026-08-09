import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { getConsumableCheckedAt, getDataFreshness } from "../src/utils/dataFreshness";

describe("getDataFreshness", () => {
  const now = new Date("2026-08-09T00:00:00Z");

  it("90일 이하는 최근 확인으로 표시한다", () => {
    expect(getDataFreshness("2026-05-11", now).status).toBe("current");
  });

  it("90일 초과 180일 이하는 재확인 예정으로 표시한다", () => {
    expect(getDataFreshness("2026-05-10", now).status).toBe("review-soon");
  });

  it("180일을 초과하면 재확인 필요로 표시한다", () => {
    expect(getDataFreshness("2026-02-09", now).status).toBe("stale");
  });

  it("소모품은 공식 출처와 구매 링크 중 가장 오래된 확인일을 사용한다", () => {
    const part = consumables[0];
    const expected = [...part.sources, ...part.purchaseLinks]
      .map((item) => item.checkedAt)
      .sort((left, right) => Date.parse(left) - Date.parse(right))[0];

    expect(getConsumableCheckedAt(part)).toBe(expected);
  });
});
