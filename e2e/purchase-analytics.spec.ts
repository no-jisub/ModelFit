import { expect, test } from "@playwright/test";
for (const channel of ["coupang", "official"]) {
  const direct = channel === "coupang";
  test(
    direct
      ? "구매 버튼 실제 클릭을 한 번 기록한다"
      : "공식 참고 링크를 구매 클릭으로 기록하지 않는다",
    async ({ page }) => {
      await page.goto("/model/lg/as355nsna");
      const link = page
        .locator(
          'a[data-purchase-channel="' +
            channel +
            '"][data-link-status="' +
            (direct ? "direct-product" : "official-reference") +
            '"]',
        )
        .first();
      await expect(link).toBeVisible();
      const partId = await link.getAttribute("data-part-id");
      const productKind = await link.getAttribute("data-product-kind");
      const optionId = await link.getAttribute("data-product-option-id");
      // Prevent external navigation while allowing the real bubbling click handler to run.
      await link.evaluate((anchor) =>
        anchor.addEventListener("click", (event) => event.preventDefault()),
      );
      await link.click();
      const events = await page.evaluate(() =>
        window.modelfitAnalyticsQueue?.filter((event) => event.name === "purchase_link_click"),
      );
      expect(events).toHaveLength(direct ? 1 : 0);
      if (direct)
        expect(events?.[0].params).toMatchObject({
          channel,
          product_kind: productKind,
          part_id: partId,
          product_option_id: optionId,
          link_status: "direct-product",
        });
    },
  );
}
