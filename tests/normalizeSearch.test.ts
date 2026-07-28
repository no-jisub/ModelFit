import { describe, expect, it } from "vitest";
import { normalizeSearch } from "../src/utils/normalizeSearch";

describe("normalizeSearch", () => {
  it("공백, 하이픈, 언더스코어와 대소문자를 정규화한다", () => {
    expect(normalizeSearch(" AX60 R5080_WD ")).toBe("ax60r5080wd");
  });

  it("한글 브랜드 별칭을 영문 키로 정규화한다", () => {
    expect(normalizeSearch("삼성")).toBe("samsung");
    expect(normalizeSearch("엘지")).toBe("lg");
  });
});
