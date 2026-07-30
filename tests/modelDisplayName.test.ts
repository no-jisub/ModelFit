import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { getModelDisplayName, getModelFullName } from "../src/utils/modelDisplayName";

describe("모델 표시명", () => {
  it("모델명 앞에 중복된 한글 브랜드를 제거한다", () => {
    const model = models.find((item) => item.id === "coway-ap-4025d");

    expect(model && getModelDisplayName(model)).toBe("노블 공기청정기");
    expect(model && getModelFullName(model)).toBe("코웨이 노블 공기청정기");
  });

  it("모델명 앞에 중복된 영문 브랜드를 제거한다", () => {
    const model = models.find((item) => item.id === "lg-as355nsna");

    expect(model && getModelDisplayName(model)).toBe("퓨리케어 360° 공기청정기");
    expect(model && getModelFullName(model)).toBe("LG 퓨리케어 360° 공기청정기");
  });
});
