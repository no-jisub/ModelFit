import { expect, test } from "vitest";
import { getPackageQuantity } from "../src/utils/packageQuantity";

test("단일 품목의 명시된 개수만 가격 비교에 사용한다", () => {
  expect(getPackageQuantity("극세필터 6개입")).toBe(6);
  expect(getPackageQuantity("1개")).toBe(1);
  for (const label of [
    undefined,
    "수량은 구매처에서 확인",
    "필터 2개 + 브러시 1개",
    "필터 세트 2개",
    "모델 AS205NGJA",
  ]) {
    expect(getPackageQuantity(label)).toBeUndefined();
  }
});
