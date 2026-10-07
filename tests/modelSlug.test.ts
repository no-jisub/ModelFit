import { describe, expect, it } from "vitest";
import { toModelId, toModelSlug } from "../src/utils/modelSlug";

describe("model slug", () => {
  it("기존 모델 URL 규칙을 유지한다", () => {
    expect(toModelSlug("X20+")).toBe("x20-plus");
    expect(toModelSlug("퓨리케어 360°")).toBe("퓨리케어-360");
    expect(toModelId("roborock", "S10 MAXV ULTRA")).toBe("roborock-s10-maxv-ultra");
  });
});
