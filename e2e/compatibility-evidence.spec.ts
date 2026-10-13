import { expect, test } from "@playwright/test";

test("코웨이 설명서의 필터 구성 확인과 판매자 호환 상품을 구분한다", async ({ page }) => {
  await page.goto("/model/coway/ap-1521b#compatible-parts");
  for (const id of [
    "coway-4d-pre-filter",
    "coway-4d-dimensional-filter",
    "coway-air-matching-filter",
  ]) {
    const part = page.locator("#" + id);
    await expect(part.getByTitle("공식 호환 확인 상태")).toBeVisible();
    await expect(part).toContainText("모델별 필터 규격은 다를 수 있으므로");
    await part.locator(".part-details > summary").click();
    await expect(
      part.locator('a[href="https://www.coway.com/core/product/fmanual/download/116"]').first(),
    ).toBeVisible();
  }
  const option = page.locator(
    "#coway-4d-dimensional-filter .product-options-section .product-verification-badge:not(.sr-only)",
  );
  await expect(option).toHaveText("판매자 호환 표기");
  await page.goto("/model/coway/ap-2021a#compatible-parts");
  const aftermarket = page.locator("#coway-ap2021-compatible-4d-filter");
  await expect(aftermarket.getByTitle("미검증 상태")).toBeVisible();
  await expect(aftermarket.getByTitle("공식 호환 확인 상태")).toHaveCount(0);
});

test("웰스 AN730은 다른 모델의 사양 대신 정확한 모델 출처를 연결한다", async ({ page }) => {
  await page.goto("/model/wells/an730#compatible-parts");
  await expect(page.getByTitle("미검증 상태")).toHaveCount(0);
  const details = page.locator(".part-details > summary");
  for (const summary of await details.all()) await summary.click();
  await expect(
    page
      .locator('a[href="https://m.kyowonwells.com/Product/Detail?grpIdx=1232&productIdx=374"]')
      .first(),
  ).toBeVisible();
});
