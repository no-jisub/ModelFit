import { describe, expect, it } from "vitest";
import {
  normalizeReportInput,
  reportExpiresAt,
  validateReportInput,
  type ReportInput,
} from "../src/lib/reports/schema";

const validInput: ReportInput = {
  category: "compatibility",
  productName: " 삼성 AX90 ",
  pageUrl: "https://modelfit-kr.web.app/model/samsung/ax90",
  description: " 호환 필터 번호가 다릅니다. ",
  evidenceUrl: "https://www.samsung.com/example",
};

describe("오류 제보 데이터", () => {
  it("저장 전에 공백을 정리한다", () => {
    expect(normalizeReportInput(validInput).productName).toBe("삼성 AX90");
    expect(normalizeReportInput(validInput).description).toBe("호환 필터 번호가 다릅니다.");
  });

  it("필수 항목과 URL 형식을 검증한다", () => {
    expect(validateReportInput(validInput)).toEqual([]);
    expect(
      validateReportInput({
        ...validInput,
        productName: "",
        pageUrl: "javascript:alert(1)",
        description: "",
      }),
    ).toHaveLength(3);
  });

  it("제보를 1년간 보관한다", () => {
    expect(reportExpiresAt(new Date("2026-08-10T00:00:00Z")).toISOString()).toBe(
      "2027-08-10T00:00:00.000Z",
    );
  });
});
