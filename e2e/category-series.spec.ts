import { expect, test } from "@playwright/test";

test("코웨이와 쿠쿠는 확인된 제품 시리즈별로 구분한다", async ({ page }) => {
  await page.goto("/category/air-purifier");
  const filter = page.locator("[data-category-model-filter]");
  await filter.evaluate((element) => ((element as HTMLDetailsElement).open = true));
  for (const [brand, series, count, sample] of [
    ["coway", "노블2", 2, "AP-4025D"],
    ["coway", "노블", 2, "AP-2021A"],
    ["coway", "듀얼 스마트", 1, "AP-2219K"],
    ["cuckoo", "헤리티지", 2, "AC-23AH10FNW"],
    ["cuckoo", "브릭2", 1, "AC-14L10FEW"],
    ["cuckoo", "T8700", 1, "AC-17T20FWH"],
  ] as const) {
    await filter.locator(`[data-filter-brand="${brand}"]`).click();
    await filter.locator(`[data-series-brand="${brand}"] [data-filter-series="${series}"]`).click();
    const models = page.locator(".category-model-filter-item:not([hidden])");
    await expect(models).toHaveCount(count);
    await expect(models.filter({ hasText: sample })).toHaveCount(1);
  }
});

test("LG는 공식 라인업에 맞게 AI 360°, 플러스, Hit로 구분한다", async ({ page }) => {
  await page.goto("/category/air-purifier");
  const filter = page.locator("[data-category-model-filter]");
  await filter.evaluate((element) => ((element as HTMLDetailsElement).open = true));
  await filter.locator('[data-filter-brand="lg"]').click();
  const series = filter.locator('[data-series-brand="lg"]');
  for (const [name, count, sample] of [
    ["AI 360°", 7, "AS205NGJA"],
    ["360° 플러스", 5, "AS305DWWL"],
    ["360° Hit", 3, "AS153HWWC"],
  ] as const) {
    const button = series.locator(`[data-filter-series="${name}"]`);
    await expect(button).toContainText(String(count));
    await button.click();
    const models = page.locator(".category-model-filter-item:not([hidden])");
    await expect(models).toHaveCount(count);
    await expect(models.filter({ hasText: sample })).toHaveCount(1);
    for (const item of await models.all()) await expect(item).toHaveAttribute("data-series", name);
  }
  await expect(series.getByText("에어로타워 Hit", { exact: true })).toHaveCount(0);
});

test("브랜드별 시리즈 선택은 검색과 함께 적용되고 브랜드 변경 시 초기화된다", async ({ page }) => {
  await page.goto("/category/air-purifier");
  const filter = page.locator("[data-category-model-filter]");
  await filter.evaluate((element) => ((element as HTMLDetailsElement).open = true));
  const seriesFilter = filter.locator("[data-series-filter]");
  const visibleModels = page.locator(".category-model-filter-item:not([hidden])");
  await expect(seriesFilter).toBeHidden();
  await filter.locator('[data-filter-brand="winix"]').click();
  const series = filter.locator('[data-series-brand="winix"]');
  await expect(series).toBeVisible();
  await expect(series.locator('[data-filter-series="타워"]')).toContainText("2");
  await series.locator('[data-filter-series="타워"]').click();
  await expect(visibleModels).toHaveCount(2);
  await expect(filter.locator("[data-filter-result]")).toHaveText("2개 모델");
  for (const item of await visibleModels.all()) {
    await expect(item).toHaveAttribute("data-brand-id", "winix");
    await expect(item).toHaveAttribute("data-series", "타워");
  }
  const query = filter.locator("[data-model-filter-query]");
  await query.fill("APRM833");
  await expect(visibleModels).toHaveCount(1);
  await query.fill("없는모델번호");
  await expect(visibleModels).toHaveCount(0);
  await expect(page.locator("[data-filter-empty]")).toBeVisible();
  await query.fill("");
  await filter.locator('[data-filter-brand="skmagic"]').click();
  await expect(series).toBeHidden();
  await expect(
    filter.locator('[data-series-brand="skmagic"] [data-filter-series="all"]'),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(visibleModels).toHaveCount(5);
  await filter.locator('[data-filter-brand="all"]').click();
  await expect(seriesFilter).toBeHidden();
  await expect(visibleModels).toHaveCount(50);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("로봇청소기도 브랜드별 등록 시리즈로 좁힐 수 있다", async ({ page }) => {
  await page.goto("/category/robot-vacuum");
  const filter = page.locator("[data-category-model-filter]");
  await filter.evaluate((element) => ((element as HTMLDetailsElement).open = true));
  await filter.locator('[data-filter-brand="roborock"]').click();
  await filter.locator('[data-series-brand="roborock"] [data-filter-series="Qrevo"]').click();
  await expect(page.locator(".category-model-filter-item:not([hidden])")).toHaveCount(2);
  await expect(filter.locator("[data-filter-result]")).toHaveText("2개 모델");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
