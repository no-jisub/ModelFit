import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

const responsiveRoutes = [
  { name: "홈", path: "/" },
  { name: "검색", path: "/find?q=ADQ30041405" },
  { name: "공기청정기 카테고리", path: "/category/air-purifier" },
  { name: "모델 상세", path: "/model/lg/as355nsna" },
  { name: "제휴 안내", path: "/affiliate-disclosure" },
];

for (const route of responsiveRoutes) {
  test(`${route.name} 390px 화면에 가로 넘침이 없다`, async ({ page }) => {
    await page.goto(route.path);

    const dimensions = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.viewportWidth).toBe(390);
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  });
}

test("390px 헤더는 검색과 검증 기준 메뉴를 두 줄로 제공한다", async ({ page }) => {
  await page.goto("/");

  const header = page.locator("header");
  const searchInput = header.getByRole("combobox", { name: "모델번호·부품번호 검색" });
  const searchButton = header.getByRole("button", { name: "소모품 찾기" });
  const headerBox = await header.boundingBox();
  const buttonBox = await searchButton.boundingBox();

  expect(headerBox?.height).toBeGreaterThanOrEqual(110);
  expect(headerBox?.height).toBeLessThanOrEqual(120);
  await expect(searchInput).toHaveAttribute("placeholder", "모델번호·부품번호 검색");
  await expect(searchInput).toBeVisible();
  expect(buttonBox?.width).toBeGreaterThanOrEqual(88);

  await searchInput.fill("AS355");
  const autocomplete = header.locator(".autocomplete-panel");
  await expect(autocomplete).toBeVisible();
  const autocompleteBox = await autocomplete.boundingBox();
  expect(autocompleteBox?.y).toBeGreaterThanOrEqual(headerBox?.height ?? 0);

  await header.locator(".mobile-menu > summary").click();
  await expect(header.getByRole("link", { name: "검증 기준" })).toBeVisible();
});

test("390px 카테고리 필터는 버튼으로 펼쳐진다", async ({ page }) => {
  await page.goto("/category/air-purifier");

  const filter = page.locator("[data-category-model-filter]");
  await expect(filter).not.toHaveAttribute("open", "");
  await filter.locator("summary").click();
  await expect(filter).toHaveAttribute("open", "");
  await expect(filter.getByRole("searchbox", { name: "모델번호" })).toBeVisible();
  await expect(filter.getByRole("button", { name: "LG", exact: true })).toBeVisible();
});
test("390px 홈 카테고리 카드는 세로로 배치된다", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator(".home-category-section .category-card");
  await expect(cards).toHaveCount(2);
  const firstCard = await cards.nth(0).boundingBox();
  const secondCard = await cards.nth(1).boundingBox();

  expect(Math.abs((firstCard?.x ?? 0) - (secondCard?.x ?? 0))).toBeLessThanOrEqual(1);
  expect(secondCard?.y).toBeGreaterThan((firstCard?.y ?? 0) + (firstCard?.height ?? 0));
});

test("390px 검색 화면에서 결과 탭의 우선순위가 분명하다", async ({ page }) => {
  await page.goto("/find?q=ADQ30041405");

  const modelTab = page.getByRole("tab", { name: /모델 2/ });
  const partTab = page.getByRole("tab", { name: /소모품 1/ });
  await expect(modelTab).toBeVisible();
  await expect(partTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: /소모품 1/ })).toBeVisible();
});

test("390px 모델 상세에서 주요 행동을 먼저 제공한다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");

  await expect(page.getByRole("link", { name: "정보 수정 제보" }).first()).toBeVisible();
  const compatiblePartsCta = page.getByRole("link", { name: /호환 소모품 2개 보기/ });
  await expect(compatiblePartsCta).toBeVisible();
  await compatiblePartsCta.click();
  await expect(page).toHaveURL(/#compatible-parts$/);
  await expect(page.getByRole("heading", { name: /^호환 소모품 \d+개$/ })).toBeVisible();
});
