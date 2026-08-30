import { expect, test } from "@playwright/test";

const disclosure =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

for (const model of ["as355nsna", "as205ngja"]) {
  test(`${model}의 모든 쿠팡 상품 링크 바로 아래에 제휴 고지를 표시한다`, async ({ page }) => {
    await page.goto(`/model/lg/${model}`);
    const links = page.locator('a[data-purchase-channel="coupang"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      const notice = link.locator("+ .affiliate-disclosure");
      await expect(notice).toBeVisible();
      await expect(notice).toContainText(disclosure);
      const linkBox = await link.boundingBox();
      const noticeBox = await notice.boundingBox();
      expect(noticeBox!.y).toBeGreaterThanOrEqual(linkBox!.y + linkBox!.height);
      expect(noticeBox!.x + noticeBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    }
    for (const link of await page.locator('a[data-purchase-channel="official"]').all()) {
      await expect(link.locator("+ .affiliate-disclosure")).toHaveCount(0);
    }
  });
}

test("홈 쿠팡 배너 바로 아래에도 동일한 제휴 고지를 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("[data-coupang-category-banner] + .affiliate-disclosure"),
  ).toContainText(disclosure);
});
