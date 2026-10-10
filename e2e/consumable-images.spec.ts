import { expect, test } from "@playwright/test";
import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";

const illustrated = consumables.filter((part) => part.image);
const getBrandId = (part: (typeof consumables)[number]) =>
  models.find((model) => model.consumableIds.includes(part.id))!.brandId;
const brands = [...new Set(illustrated.map(getBrandId))];
for (const brandId of brands) {
  test(brandId + " 소모품 참고 이미지는 최적화된 로컬 자산으로 표시한다", async ({ page }) => {
    test.setTimeout(60_000);
    const grouped = new Map<string, typeof illustrated>();
    for (const part of illustrated.filter((part) => getBrandId(part) === brandId)) {
      const model = models.find((model) => model.consumableIds.includes(part.id))!;
      const path = `/model/${model.brandId}/${model.slug}`;
      grouped.set(path, [...(grouped.get(path) ?? []), part]);
    }
    for (const [path, parts] of grouped) {
      await page.goto(path);
      for (const part of parts) {
        const image = page.locator(`#${part.id} .part-image img`);
        const figure = page.locator(`#${part.id} .part-image`);
        await figure.scrollIntoViewIfNeeded();
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute("src", /^\/_astro\/.+\.webp$/);
        await expect
          .poll(() =>
            image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
          )
          .toBe(true);
        await expect(page.locator(`#${part.id} .part-image figcaption`)).toHaveText(
          "정품 참고 이미지",
        );
        const focusWindow = figure.locator(".part-image-focus-window");
        if (await focusWindow.count()) {
          await expect(focusWindow).toBeInViewport();
          const [windowBounds, figureBounds] = await Promise.all([
            focusWindow.boundingBox(),
            figure.boundingBox(),
          ]);
          expect(windowBounds!.width).toBeGreaterThan(0);
          expect(windowBounds!.height).toBeGreaterThan(0);
          expect(windowBounds!.width).toBeLessThanOrEqual(figureBounds!.width + 1);
          expect(windowBounds!.height).toBeLessThanOrEqual(figureBounds!.width + 1);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
  });
}
