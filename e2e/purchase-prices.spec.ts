import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { isFreshPrice, type PurchasePriceSnapshot } from "../src/lib/purchase-price";

const snapshots: PurchasePriceSnapshot[] = [];
for (const file of ["outputs/purchase-prices.json", "outputs/official-purchase-prices.json"]) {
  try {
    snapshots.push(...JSON.parse(readFileSync(file, "utf8")).prices);
  } catch {
    /* PR builds may omit live prices. */
  }
}
test("조회한 가격과 공식몰 회원가 조건을 실제 구매 버튼 옆에 표시한다", async ({ page }) => {
  const examples = [
    {
      linkId: "lg-puricare-g-filter-coupang",
      optionId: "lg-puricare-g-filter-genuine-option",
      label: "조회 가격",
    },
    {
      linkId: "lg-360-v2-filter-official",
      optionId: "lg-360-v2-filter-genuine-option",
      label: "회원할인가",
    },
  ];
  const fresh = examples
    .map((example) => ({
      example,
      snapshot: snapshots.find(
        (snapshot) =>
          snapshot.linkId === example.linkId && isFreshPrice(snapshot, snapshot.linkUrl),
      ),
    }))
    .filter((entry) => entry.snapshot);
  test.skip(fresh.length === 0, "현재 조회 가격 파일이 없는 빌드");
  await page.goto("/model/lg/as205ngja#compatible-parts");
  for (const { example, snapshot } of fresh) {
    const row = page
      .locator("article.product-option-card")
      .filter({ has: page.locator(`#${example.optionId}-heading`) });
    await expect(row.locator(".purchase-price strong")).toHaveText(
      `${snapshot!.amount.toLocaleString("ko-KR")}원`,
    );
    await expect(row.locator(".price-heading span")).toHaveText(example.label);
    await expect(row.locator(".price-note")).not.toContainText(/\d{4}-\d{2}-\d{2}/);
    if (example.label === "회원할인가")
      await expect(row.locator(".price-note")).toContainText("회원 로그인 기준");
    await expect(row.getByRole("link", { name: /구매하기/ })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
