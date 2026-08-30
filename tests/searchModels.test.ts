import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { searchModels } from "../src/utils/searchModels";

describe("searchModels", () => {
  it("모델 코드 완전 일치를 가장 먼저 반환한다", () => {
    expect(searchModels(models, "AS355NSNA")[0]?.model.id).toBe("lg-as355nsna");
  });

  it("공백과 하이픈을 제거해 검색한다", () => {
    expect(searchModels(models, "AS355 NS-NA")[0]?.model.id).toBe("lg-as355nsna");
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

  it("강한 모델 일치를 브랜드명만 일치하는 결과보다 먼저 반환한다", () => {
    const results = searchModels(models, "로보락 S8");

    expect(results[0]?.model.id).toBe("roborock-s8-maxv-ultra");
    expect(results[0]?.score).toBeGreaterThan(results[1]?.score ?? 0);
  });
});
