import { expect, test } from "@playwright/test";

test("기본 필터 종류와 수량은 모델별로 표시한다", async ({ page }) => {
  for (const [model, name, quantity] of [
    ["as355nsna", "360° 퓨리탈취청정 M 필터", 2],
    ["as355nsah", "360° 퓨리탈취청정 G 필터", 2],
    ["as356nsma", "360° 강력탈취청정 M7 필터", 2],
    ["as186hwwa", "360° 탈취청정 V2 필터", 1],
    ["as183hwwa", "360° H 필터", 1],
    ["as303dwfa", "360° V 필터", 2],
  ] as const) {
    await page.goto(`/model/lg/${model}#compatible-parts`);
    const note = page.locator(".default-filter-note");
    await expect(note).toHaveCount(1);
    await expect(note).toContainText(`기본 장착 필터: ${name} · ${quantity}개`);
    await expect(note.getByRole("link", { name: "공식 제품 사양" })).toHaveAttribute(
      "href",
      /^https:\/\/www\.lge\.co\.kr\//,
    );
  }
});

test("AS153HWWC의 기본 장착 필터는 호환 교체 상품과 구분한다", async ({ page }) => {
  await page.goto("/model/lg/as153hwwc#compatible-parts");
  const note = page.locator(".default-filter-note");
  await expect(note).toBeVisible();
  await expect(note).toContainText("기본 장착 필터: 360° V 필터 · 1개");
  await expect(note.getByRole("link", { name: "공식 제품 사양" })).toHaveAttribute(
    "href",
    "https://www.lge.co.kr/product/air-purifier/as153hwwc-akor1",
  );
  await expect(page.getByText("기본 장착 필터: H", { exact: true })).toHaveCount(0);
  await expect(page.locator(".model-compatibility-summary")).toHaveCount(0);
  await expect(page.getByText("제품 라벨의 모델번호가", { exact: false })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/model/lg/as205ngja#compatible-parts");
  await expect(page.locator(".default-filter-note")).toContainText(
    "기본 장착 필터: 360° 퓨리탈취청정 G 필터 · 1개",
  );
});

test("기본 M7과 호환 M5 안내는 상세 정보를 열지 않아도 보인다", async ({ page }) => {
  await page.goto("/model/lg/as356nsma#lg-360-m5-filter");
  const group = page
    .locator("article.consumable-group")
    .filter({ has: page.locator("#lg-360-m5-filter-genuine-option-heading") });
  await expect(group.locator(".product-fit-note")).toHaveText(
    "기본 M7 필터 대신 사용할 수 있는 M5 교체 필터입니다.",
  );
  await expect(group.locator(".product-fit-note")).toBeVisible();
  await expect(group.locator("details")).not.toHaveAttribute("open", "");
  await expect(group.locator(".purchase-quantity-summary")).toContainText("2개 필요");
  await expect(
    group.locator('a[data-part-id="lg-360-m5-filter"][data-link-status="direct-product"]'),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto("/model/lg/as336nslc#lg-360-m5-filter");
  await expect(page.locator(".product-fit-note")).toHaveText("기본 장착 필터: M5");
});

test("미확인 쿠팡 상품 대신 검증한 공식몰 개별 필터를 안내한다", async ({ page }) => {
  for (const [path, id, url] of [
    [
      "/model/cuckoo/ac-17t20fwh",
      "cuckoo-acf-tmt20-filter",
      "https://www.cuckoo.co.kr/mall/productView?productNo=9038",
    ],
    [
      "/model/winix/azse430-jwk",
      "winix-zero-s-deodorizing-filter",
      "https://www.winix.com/product/2",
    ],
  ]) {
    await page.goto(`${path}#${id}`);
    const group = page.locator(`#${id}`);
    await expect(group.getByRole("link", { name: "공식몰에서 구매하기" })).toHaveAttribute(
      "href",
      url,
    );
    await expect(
      group.locator(".product-option-list [data-purchase-channel='coupang']"),
    ).toHaveCount(0);
    await expect(group.locator(".product-option-row")).toHaveCount(1);
  }
});
