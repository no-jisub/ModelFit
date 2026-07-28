import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { searchModels } from "../src/utils/searchModels";

describe("searchModels", () => {
  it("모델 코드 완전 일치를 가장 먼저 반환한다", () => {
    expect(searchModels(models, "AP90H10198EDD")[0]?.model.id).toBe("samsung-ap90h10198edd");
  });

  it("공백과 하이픈을 제거해 검색한다", () => {
    expect(searchModels(models, "AP90 H10198-EDD")[0]?.model.id).toBe("samsung-ap90h10198edd");
  });

  it("한글·영문 브랜드 별칭 검색을 지원한다", () => {
    expect(searchModels(models, "로보락 S8 MAXV ULTRA")[0]?.model.id).toBe(
      "roborock-s8-maxv-ultra",
    );
    expect(searchModels(models, "Roborock S8 MAXV ULTRA")[0]?.model.id).toBe(
      "roborock-s8-maxv-ultra",
    );
  });

  it("완전 일치를 부분 일치보다 우선한다", () => {
    const results = searchModels(models, "S8 MAXV ULTRA");
    expect(results[0]?.model.id).toBe("roborock-s8-maxv-ultra");
  });
});
