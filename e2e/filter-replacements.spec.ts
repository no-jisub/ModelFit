import { expect, test } from "@playwright/test";

test("기본 M7과 호환 M5 안내는 상세 정보를 열지 않아도 보인다", async ({ page }) => {
  await page.goto("/model/lg/as356nsma#lg-360-m5-filter");
  const group = page.locator("#lg-360-m5-filter");
  await expect(group.locator(".part-fit-note")).toHaveText(
    "기본 M7 필터 대신 사용할 수 있는 M5 교체 필터입니다.",
  );
  await expect(group.locator(".part-fit-note")).toBeVisible();
  await expect(group.locator("details")).not.toHaveAttribute("open", "");
  await expect(group.locator(".purchase-quantity-summary")).toContainText("2개 필요");
  await expect(group.getByRole("link", { name: "공식몰에서 구매하기" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto("/model/lg/as336nslc#lg-360-m5-filter");
  await expect(page.locator("#lg-360-m5-filter .part-fit-note")).toHaveText("기본 장착 필터: M5");
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
