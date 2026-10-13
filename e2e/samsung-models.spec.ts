import { expect, test } from "@playwright/test";

test("삼성 대표 모델은 모델별 공식 적용 필터를 안내한다", async ({ page }) => {
  await page.goto("/category/air-purifier");
  const filter = page.locator("[data-category-model-filter]");
  await filter.evaluate((element) => ((element as HTMLDetailsElement).open = true));
  await filter.locator('[data-filter-brand="samsung"]').click();
  const cards = page.locator(".category-model-filter-item:not([hidden])");
  await expect(cards).toHaveCount(2);
  await expect(cards.filter({ hasText: "AX033B310GBD" }).locator(".model-series")).toHaveText(
    "AX033B310GBD",
  );
  for (const [model, code, product] of [
    ["ax033b310gbd", "CFX-K100D", "0000115269"],
    ["ax90t7020wdd", "CFX-C100D", "0000010255"],
  ]) {
    await page.goto(`/model/samsung/${model}#compatible-parts`);
    await expect(page.locator(".part-number-inline code")).toHaveText(code);
    await expect(page.getByRole("link", { name: "공식몰에서 구매하기" })).toHaveAttribute(
      "href",
      `https://www.samsungsvc.co.kr/shop/product/${product}`,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test("변환 실패한 일반 쿠팡 구매 버튼 대신 확인된 공식 상품을 안내한다", async ({ page }) => {
  await page.goto("/model/winix/aprm833-jwk#compatible-parts");
  const group = page.locator("#winix-tower-prime-all-in-one-filter");
  await expect(group.locator('[data-purchase-channel="coupang"]')).toHaveCount(0);
  await expect(group.getByRole("link", { name: "공식몰에서 구매하기" })).toHaveAttribute(
    "href",
    "https://www.winix.com/product/142",
  );
});
