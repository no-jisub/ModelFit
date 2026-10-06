import { expect, test } from "@playwright/test";

test("부품 카드의 상세 정보 하나에서 관리·상품 설명·구매처 없는 안내를 확인한다", async ({
  page,
}) => {
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
  await expect(part.locator(".product-options-section .product-option-details")).toContainText(
    "2개 필요",
  );
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
test("검토한 대체 구매 링크와 묶음·선택 구성을 구분한다", async ({ page }) => {
  for (const model of ["x20-plus", "x10-plus"]) {
    await page.goto("/model/xiaomi/" + model + "#compatible-parts");
    for (const [partType, productId] of [
      ["main-brush", "8518462768"],
      ["side-brush", "8305225725"],
    ]) {
      const part = page.locator("#xiaomi-" + model + "-" + partType);
      const link = part.locator('a[data-link-status="direct-product"]');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute("href", new RegExp("/vp/products/" + productId));
      await expect(part.locator(".product-options-section .product-verification-badge")).toHaveText(
        "판매자 정품 표기",
      );
    }
  }
  await expect(
    page.locator("#xiaomi-x10-plus-dust-bag a[data-link-status=direct-product]"),
  ).toHaveAttribute("href", /8518458631/);
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

test("쿠팡 상품이 없으면 국내 공식몰 구매 링크를 표시하고 클릭을 기록한다", async ({ page }) => {
  await page.goto("/model/everybot/q11#compatible-parts");
  for (const partId of [
    "everybot-q11-filter",
    "everybot-q11-side-brush",
    "everybot-q11-dust-bag",
  ]) {
    const part = page.locator("#" + partId);
    await expect(part.getByRole("link", { name: /공식몰에서 구매하기/ })).toBeVisible();
    await expect(part.locator(".affiliate-disclosure")).toHaveCount(0);
    await expect(part.getByRole("link", { name: /쿠팡에서 구매하기/ })).toHaveCount(0);
  }
  const link = page.locator('#everybot-q11-filter a[data-link-status="direct-product"]');
  await link.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
  await link.click();
  const clicks = await page.evaluate(() =>
    window.modelfitAnalyticsQueue?.filter((e) => e.name === "purchase_link_click"),
  );
  expect(clicks).toHaveLength(1);
  expect(clicks?.[0].params).toMatchObject({
    part_id: "everybot-q11-filter",
    channel: "official",
    link_status: "direct-product",
  });
  await page.goto("/model/dyson/tp09#compatible-parts");
  await expect(
    page.locator('#dyson-360-glass-hepa-carbon-filter a[data-link-status="direct-product"]'),
  ).toHaveAttribute("href", "https://www.dyson.co.kr/360-glass-hepa-carbon-air-purifier-filter");
});

test("직접 구매처가 없는 부품은 공식몰 확인을 앞에 표시하고 구매 클릭과 구분한다", async ({
  page,
}) => {
  await page.goto("/model/eufy/omni-c28#compatible-parts");
  const part = page.locator("#eufy-c28-filter");
  const link = part
    .locator(".product-options-section")
    .getByRole("link", { name: /해외 공식몰에서 부품 확인/ });
  await expect(link).toBeVisible();
  await expect(part.locator(".part-details")).not.toHaveAttribute("open", "");
  await expect(link).toHaveAttribute("data-link-status", "official-reference");
  await expect(part.locator('a[data-link-status="direct-product"]')).toHaveCount(0);
  await link.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
  await link.click();
  expect(
    await page.evaluate(
      () => window.modelfitAnalyticsQueue?.filter((e) => e.name === "purchase_link_click") ?? [],
    ),
  ).toHaveLength(0);
});
