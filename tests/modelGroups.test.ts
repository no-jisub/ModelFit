import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { groupModelsByName } from "../src/utils/modelGroups";
import { formatModelReleaseDate } from "../src/utils/modelReleaseDate";

describe("모델 제품군", () => {
  it("브랜드와 모델명이 같은 모델번호를 하나로 묶는다", () => {
    const samsungModels = models.filter((model) => model.brandId === "samsung");
    const groups = groupModelsByName(samsungModels);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.models).toHaveLength(5);
    expect(groups[0]?.models.map((model) => model.modelCode)).toContain("AP90H10198EDD");
  });

  it("브랜드가 다르면 같은 모델명이어도 별도 제품군으로 유지한다", () => {
    const first = models[0];
    const second = models[1];
    if (!first || !second) throw new Error("테스트 모델이 필요합니다.");

    const groups = groupModelsByName([
      first,
      { ...second, brandId: "another-brand", modelName: first.modelName },
    ]);

    expect(groups).toHaveLength(2);
  });

  it("출시 연월을 한국어로 표시하고 미등록 상태를 구분한다", () => {
    expect(formatModelReleaseDate("2026-02")).toBe("2026년 2월 출시");
    expect(formatModelReleaseDate()).toBe("출시일 확인 중");
  });
});
