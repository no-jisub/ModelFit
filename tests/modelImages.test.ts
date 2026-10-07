import { access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { modelImages } from "../src/data/modelImages";
import { models } from "../src/data/models";

describe("model images", () => {
  it("검증된 본체 이미지를 모델에 연결하고 확인하지 못한 모델만 제외한다", () => {
    const missingIds = models.filter((model) => !model.image).map((model) => model.id);

    expect(missingIds).toEqual([]);
    expect(Object.keys(modelImages)).toHaveLength(models.length);
  });

  it("이미지 주소와 출처 확인일을 검증하고 로컬 WebP 규격을 유지한다", async () => {
    await Promise.all(
      Object.entries(modelImages).map(async ([id, image]) => {
        const isLocal = image.src.startsWith("/");
        if (isLocal) expect(image.src).toBe(`/images/models/${id}.webp`);
        else {
          const source = new URL(image.src);
          expect(source.protocol).toBe("https:");
          expect(source.username).toBe("");
          expect(source.password).toBe("");
        }
        expect(image.alt).toContain("제품 본체");
        expect(image.sourceUrl.startsWith("https://")).toBe(true);
        expect(Number.isNaN(Date.parse(image.checkedAt))).toBe(false);

        if (!isLocal) return;
        const imagePath = path.resolve("public", image.src.slice(1));
        await access(imagePath);
        const metadata = await sharp(imagePath).metadata();
        expect(metadata.format).toBe("webp");
        expect(metadata.width).toBe(720);
        expect(metadata.height).toBe(720);
      }),
    );
  });
});
