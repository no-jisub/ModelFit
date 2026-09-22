import { access } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { brands } from "../src/data/brands";
import { categories, categoryById, categoryIds, isApplianceCategory } from "../src/data/categories";
import { guides } from "../src/data/guides";
import { models } from "../src/data/models";
import { partTypeLabels } from "../src/utils/labels";

describe("category config", () => {
  it("카테고리 식별자와 화면 설정을 한 곳에서 완전하게 제공한다", async () => {
    expect(new Set(categoryIds).size).toBe(categories.length);

    await Promise.all(
      categories.map(async (category) => {
        expect(categoryById[category.id]).toBe(category);
        expect(category.label.trim()).not.toBe("");
        expect(category.description.trim()).not.toBe("");
        expect(category.metaDescription.trim()).not.toBe("");
        expect(category.modelNumberGuide.trim()).not.toBe("");
        expect(category.partTypes.length).toBeGreaterThan(0);

        for (const partType of category.partTypes) {
          expect(partTypeLabels[partType]).toBeTruthy();
        }

        await access(path.resolve("public", category.selectorImage.slice(1)));
      }),
    );
  });

  it("모델·브랜드·가이드가 등록된 카테고리만 참조한다", () => {
    for (const model of models) expect(isApplianceCategory(model.category)).toBe(true);
    for (const brand of brands) {
      for (const category of brand.supportedCategories) {
        expect(isApplianceCategory(category)).toBe(true);
      }
    }
    for (const guide of guides) {
      expect(
        guide.category === "basics" ||
          guide.category === "maintenance" ||
          isApplianceCategory(guide.category),
      ).toBe(true);
    }
  });
});
