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

  it("브랜드 별칭과 모델번호를 함께 입력해도 정규화한다", () => {
    expect(normalizeSearch("엘지전자 AS355-NSNA")).toBe("lgas355nsna");
    expect(normalizeSearch("교원 웰스 AL106")).toBe("wellsal106");
  });

  it("모바일 키보드의 전각 영문과 숫자를 일반 문자로 정규화한다", () => {
    expect(normalizeSearch("ＡＳ３５５－ＮＳＮＡ")).toBe("as355nsna");
  });
});
