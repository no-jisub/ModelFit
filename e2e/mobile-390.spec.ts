import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

const responsiveRoutes = [
  { name: "홈", path: "/" },
  { name: "검색", path: "/find?q=ADQ30041405" },
  { name: "모델 상세", path: "/model/lg/as355nsna" },
  { name: "내 가전함", path: "/my-appliances" },
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

  await expect(page.getByRole("button", { name: "내 가전함에 추가" })).toBeVisible();
  await expect(page.getByRole("link", { name: "정보 수정 제보" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /이 모델에 연결된 소모품/ })).toBeVisible();
});
