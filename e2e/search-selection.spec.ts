import { expect, test } from "@playwright/test";

test("검색 자동완성에서 모델을 클릭해 상세 소모품 영역으로 이동한다", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const header = page.locator("header");
  const input = header.getByRole("combobox", { name: "모델번호·부품번호 검색" });
  await input.fill("X40 ULTRA");

  const option = header.getByRole("option").filter({ hasText: "드리미 X40 Ultra" }).first();
  await expect(option).toBeVisible();
  await option.click();

  await expect(page).toHaveURL(/\/model\/dreame\/x40-ultra#compatible-parts$/);
  await expect(page.getByRole("heading", { name: /드리미 X40 Ultra/ }).first()).toBeVisible();
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("검색 자동완성을 키보드로 선택해 정확한 모델로 이동한다", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const input = page.locator("header").getByRole("combobox", { name: "모델번호·부품번호 검색" });
  await input.fill("AS205NGJA");
  await expect(page.locator("header").getByRole("option").first()).toBeVisible();
  await input.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-activedescendant", /.+-0$/);
  await input.press("Enter");

  await expect(page).toHaveURL(/\/model\/lg\/as205ngja#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("로봇청소기 카테고리에서 브랜드와 모델번호를 좁혀 상세로 이동한다", async ({ page }) => {
  await page.goto("/category/robot-vacuum");

  const filter = page.locator("[data-category-model-filter]");
  const isOpen = await filter.evaluate((element) => (element as HTMLDetailsElement).open);
  if (!isOpen) await filter.locator("summary").click();

  await filter.getByRole("button", { name: "드리미", exact: true }).click();
  await filter.getByRole("searchbox", { name: "모델번호" }).fill("X40 ULTRA");
  await expect(filter.locator("[data-filter-result]")).toHaveText("1개 모델");

  const resultCard = page.locator(".category-model-filter-item:not([hidden]) .model-card").first();
  await expect(resultCard).toContainText("X40 Ultra");
  await resultCard.click();

  await expect(page).toHaveURL(/\/model\/dreame\/x40-ultra#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});
