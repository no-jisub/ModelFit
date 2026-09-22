import { expect, test } from "@playwright/test";

const affiliateDisclosure =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
const nonAffiliateDisclosure =
  "현재 쿠팡 링크는 일반 상품·검색 링크이며 모델핏은 수수료를 받지 않습니다.";

for (const model of ["as355nsna", "as205ngja"]) {
  test(`${model}의 모든 쿠팡 링크에 링크 종류에 맞는 고지를 표시한다`, async ({ page }) => {
    await page.goto(`/model/lg/${model}`);
    const links = page.locator('a[data-purchase-channel="coupang"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      const notice = link.locator("+ .affiliate-disclosure");
      const rel = (await link.getAttribute("rel")) ?? "";
      const isAffiliate = rel.split(/\s+/).includes("sponsored");

      await expect(notice).toBeVisible();
      await expect(notice).toContainText(
        isAffiliate ? affiliateDisclosure : nonAffiliateDisclosure,
      );
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

test("구매 링크가 없는 품목과 확인된 품목을 구분한다", async ({ page }) => {
  await page.goto("/model/dreame/x40s-pro-ultra");

  await expect(page.locator('a[data-purchase-channel="coupang"]')).toHaveCount(1);
  const unavailablePart = page.locator(".consumable-group").filter({
    has: page.getByRole("heading", { name: "드리미 X40s Pro Ultra 메인 브러시" }),
  });
  await expect(unavailablePart.locator('a[data-purchase-channel="coupang"]')).toHaveCount(0);
  await expect(unavailablePart.getByText("외부 판매 상품 링크는 준비 중입니다.")).toBeVisible();
  await expect(unavailablePart.getByText("구매 링크 준비 중", { exact: true })).toBeVisible();

  await page.goto("/model/wells/al106");
  await expect(page.locator('a[data-purchase-channel="coupang"]')).toHaveCount(2);
  const hepaPart = page.locator(".consumable-group").filter({
    has: page.getByRole("heading", { name: "웰스 AL106 제로클리어 HEPA H14 필터" }),
  });
  await expect(hepaPart.locator('a[data-purchase-channel="coupang"]')).toHaveCount(0);
  await expect(hepaPart.getByText("외부 판매 상품 링크는 준비 중입니다.")).toBeVisible();
});

test("홈 쿠팡 배너 바로 아래에도 동일한 제휴 고지를 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("[data-coupang-category-banner] + .affiliate-disclosure"),
  ).toContainText(affiliateDisclosure);
});
