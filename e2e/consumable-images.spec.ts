import { expect, test } from "@playwright/test";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";

test("모든 소모품 참고 이미지는 최적화된 로컬 자산으로 표시한다", async ({ page }) => {
  test.setTimeout(90_000);
  const illustrated = consumables.filter((part) => part.image);
  const grouped = new Map<string, typeof illustrated>();
  for (const part of illustrated) {
    const model = models.find((model) => model.consumableIds.includes(part.id))!;
    const path = `/model/${model.brandId}/${model.slug}`;
    grouped.set(path, [...(grouped.get(path) ?? []), part]);
  }
  for (const [path, parts] of grouped) {
    await page.goto(path);
    for (const part of parts) {
      const image = page.locator(`#${part.id} .part-image img`);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("src", /^\/_astro\/.+\.webp$/);
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);
      await expect(page.locator(`#${part.id} .part-image figcaption`)).toHaveText(
        "정품 참고 이미지",
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});
