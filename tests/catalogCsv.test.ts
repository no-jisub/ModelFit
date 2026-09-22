import { describe, expect, it } from "vitest";
import { modelCsvHeaders, parseModelCsv, validateModelCsv } from "../src/utils/catalogCsv";

const header = modelCsvHeaders.join(",");
const context = {
  categoryIds: new Set(["air-purifier", "robot-vacuum"]),
  brandCategories: new Map([
    ["dyson", new Set(["air-purifier"])],
    ["roborock", new Set(["robot-vacuum"])],
  ]),
  existingModelIds: new Set(["dyson-tp09"]),
  existingModelCodes: new Set(["tp09"]),
};

describe("model CSV import", () => {
  it("Excel UTF-8 CSV의 BOM, 큰따옴표, 쉼표와 별칭을 읽는다", () => {
    const records = parseModelCsv(
      `\uFEFF${header}\r\npublished,robot-vacuum,roborock,"Saros, 신형",S20,Saros,https://example.com/s20,공식 제품,manufacturer,2026-09-21,,,"S20|사로스, 신형"\r\n`,
    );

    expect(records).toHaveLength(1);
    expect(records[0]?.rowNumber).toBe(2);
    expect(records[0]?.values.modelName).toBe("Saros, 신형");

    const result = validateModelCsv(records, context);
    expect(result.errors).toEqual([]);
    expect(result.entries[0]?.aliases).toEqual(["S20", "사로스, 신형"]);
  });

  it("draft 행은 검사하지만 게시 데이터에는 포함하지 않는다", () => {
    const records = parseModelCsv(
      `${header}\ndraft,air-purifier,dyson,새 공기청정기,NEW01,,,,,,,,`,
    );
    const result = validateModelCsv(records, context);

    expect(result.errors).toEqual([]);
    expect(result.draftCount).toBe(1);
    expect(result.entries).toEqual([]);
  });

  it("출시일은 월 또는 날짜 단위로 받고 근거 URL과 함께 입력한다", () => {
    const monthRecord = parseModelCsv(
      `${header}\npublished,robot-vacuum,roborock,월 단위 제품,S21,Saros,https://example.com/s21,공식 제품,manufacturer,2026-09-21,2025-01,https://example.com/release,`,
    );
    expect(validateModelCsv(monthRecord, context).errors).toEqual([]);

    const missingSourceRecord = parseModelCsv(
      `${header}\npublished,robot-vacuum,roborock,근거 없는 제품,S22,Saros,https://example.com/s22,공식 제품,manufacturer,2026-09-21,2025-01,,`,
    );
    expect(validateModelCsv(missingSourceRecord, context).errors).toContain(
      "2행: releaseDate와 releaseSourceUrl은 함께 입력해야 합니다.",
    );
  });

  it("알 수 없는 카테고리와 기존 모델번호 중복을 차단한다", () => {
    const records = parseModelCsv(
      `${header}\npublished,unknown,dyson,중복 제품,TP09,,http://example.com,공식 제품,manufacturer,2026/09/21,,,`,
    );
    const result = validateModelCsv(records, context);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("등록되지 않은 category"),
        expect.stringContaining("기존 모델번호와 중복"),
        expect.stringContaining("sourceUrl은 https"),
        expect.stringContaining("verifiedAt은 YYYY-MM-DD"),
      ]),
    );
  });

  it("필수 헤더가 바뀌면 가져오기를 중단한다", () => {
    expect(() => parseModelCsv("status,category\ndraft,air-purifier")).toThrow(
      /필수 열이 없습니다/,
    );
  });
});
