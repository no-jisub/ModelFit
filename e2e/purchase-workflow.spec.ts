import { expect, test } from "@playwright/test";

test("부품 카드의 상세 정보 하나에서 관리·상품 설명·구매처 없는 안내를 확인한다", async ({
  page,
}) => {
  await page.goto("/model/xiaomi/x10-plus#compatible-parts");
  for (const id of [
    "xiaomi-x10-plus-main-brush",
    "xiaomi-x10-plus-side-brush",
    "xiaomi-x10-plus-dust-bag",
  ]) {
    await expect(
      page.locator("#" + id).locator('a[data-link-status="direct-product"]'),
    ).toHaveCount(0);
  }
  await page.goto("/model/eufy/x10-pro-omni#compatible-parts");
  const part = page.locator("#eufy-x10-pro-side-brush");
  const available = part.locator(
    ".product-options-section > .product-option-list .product-option-card",
  );
  await expect(available).toHaveCount(1);
  await expect(available.getByRole("link", { name: /쿠팡에서 구매하기/ })).toBeVisible();
  await expect(available.locator(".product-verification-badge")).toHaveText("판매자 호환 표기");
  await expect(part.locator("details")).toHaveCount(1);
  await expect(part.locator(".part-management")).not.toBeVisible();
  await expect(part.locator(".purchase-reference-options")).not.toBeVisible();
  await part.getByText("상세 정보", { exact: true }).click();
  await expect(part.locator(".part-management")).toBeVisible();
  await expect(
    part.locator(".purchase-reference-options").getByText("확인된 구매처가 없습니다."),
  ).toBeVisible();
  await expect(part.locator(".purchase-reference-options .product-kind-badge")).toHaveText("정품");
});

test("모바일은 선택 단계 없이 구매 버튼을 누르고 클릭을 한 번 기록한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/model/lg/as355nsna#compatible-parts");
  await expect(page.locator("[data-mobile-parts-jump]")).not.toBeVisible();
  await expect(
    page.locator("[data-purchase-select], [data-mobile-purchase-selection]"),
  ).toHaveCount(0);
  const part = page.locator("#lg-puricare-m-filter");
  const link = part.locator('a[data-link-status="direct-product"]');
  await expect(link).toHaveAttribute("rel", /sponsored/);
  await expect(part.locator(".affiliate-disclosure")).toBeVisible();
  await expect(part.locator(".purchase-quantity-summary")).toContainText("2개 필요");
  await expect(part.locator(".product-option-details")).toBeVisible();
  await link.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
  await link.click();
  const clicks = await page.evaluate(() =>
    window.modelfitAnalyticsQueue?.filter((e) => e.name === "purchase_link_click"),
  );
  expect(clicks).toHaveLength(1);
  expect(clicks?.[0].params).toMatchObject({
    part_id: "lg-puricare-m-filter",
    product_option_id: "lg-puricare-m-filter-genuine-option",
    channel: "coupang",
    link_status: "direct-product",
  });
});

test("상세 정보를 접어도 모델 호환 미확인과 판매자 상품 표기를 숨기지 않는다", async ({ page }) => {
  await page.goto("/model/blueair/5210i#compatible-parts");
  const part = page.locator("#blueair-dustmagnet-5200-combofilter");
  await expect(part.locator(".part-details")).not.toHaveAttribute("open", "");
  await expect(part.getByTitle("미검증 상태")).toBeVisible();
  await expect(part.locator(".part-purchase-warning").first()).toBeVisible();
  await expect(part.locator(".product-options-section .product-verification-badge")).toHaveText(
    "판매자 호환 표기",
  );
  await expect(part.getByTitle("공식 호환 확인 상태")).toHaveCount(0);
  await expect(part.getByRole("link", { name: /쿠팡에서 구매하기/ })).toBeVisible();
});
test("검토에서 상품 종류가 다른 링크는 숨기고 묶음·선택 구성을 구분한다", async ({ page }) => {
  await page.goto("/model/xiaomi/x20-plus#compatible-parts");
  for (const id of ["xiaomi-x20-plus-main-brush", "xiaomi-x20-plus-side-brush"]) {
    const part = page.locator("#" + id);
    await expect(part.locator('a[data-link-status="direct-product"]')).toHaveCount(0);
    await expect(part.locator(".product-options-section .purchase-unavailable")).toBeVisible();
  }
  await page.goto("/model/xiaomi/x10-plus#compatible-parts");
  for (const id of [
    "xiaomi-x10-plus-main-brush",
    "xiaomi-x10-plus-side-brush",
    "xiaomi-x10-plus-dust-bag",
  ]) {
    await expect(
      page.locator("#" + id).locator('a[data-link-status="direct-product"]'),
    ).toHaveCount(0);
  }
  await page.goto("/model/eufy/x10-pro-omni#compatible-parts");
  const mop = page.locator("#eufy-x10-pro-mop-cloth .product-options-section");
  await expect(
    mop.getByRole("heading", { name: "eufy X10 Pro Omni 호환 물걸레·먼지봉투 세트" }),
  ).toBeVisible();
  await expect(mop.locator(".product-option-details")).toContainText(
    "물걸레 패드 6개 + 먼지봉투 8개 묶음",
  );
  await expect(mop.locator(".product-verification-badge")).toHaveText("판매자 호환 표기");
  await page.goto("/model/everybot/q9#compatible-parts");
  await expect(
    page.locator("#everybot-q9-filter .product-options-section .product-option-details"),
  ).toContainText("필터 2개입 옵션 선택 필요");
});
