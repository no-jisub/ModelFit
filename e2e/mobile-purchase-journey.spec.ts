import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

test("모바일 모델 검색에서 소모품을 펼치지 않고 구매처까지 이동하며 이벤트를 구분한다", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mkdir("outputs/analytics", { recursive: true });
  await page.route(/https:\/\/(www\.googletagmanager\.com|[^/]*google-analytics\.com)\//, (route) =>
    route.abort(),
  );
  await page.addInitScript(() => {
    // This test-only listener persists QA events through navigation, never sends telemetry.
    window.addEventListener("modelfit:analytics", (event) => {
      const events = JSON.parse(sessionStorage.getItem("qa-events") ?? "[]");
      events.push((event as CustomEvent).detail);
      sessionStorage.setItem("qa-events", JSON.stringify(events));
    });
  });
  for (const [query, modelId, path, partId, channel] of [
    ["AS205NGJA", "lg-as205ngja", "lg/as205ngja", "lg-puricare-g-filter", "coupang"],
    ["Q9", "everybot-q9", "everybot/q9", "everybot-q9-filter", "official"],
    [
      "AX90T7020WDD",
      "samsung-ax90t7020wdd",
      "samsung/ax90t7020wdd",
      "samsung-cfx-c100d-filter",
      "official",
    ],
  ]) {
    await page.goto("/find?q=" + query);
    await expect
      .poll(() =>
        page.evaluate(() =>
          window.modelfitAnalyticsQueue?.some((e) => e.name === "search_results_viewed"),
        ),
      )
      .toBe(true);
    const result = page.locator(".search-page-app .model-card").filter({ hasText: query }).first();
    const link = result.getByRole("link", { name: query + " 소모품·구매처 보기" });
    await expect(result.locator(".model-inline-consumables")).toHaveCount(0);
    await expect(link).toBeVisible();
    await page.screenshot({ path: "outputs/analytics/mobile-search-" + query + ".png" });
    await link.click();
    await expect(page).toHaveURL(new RegExp("/model/" + path + "#compatible-parts$"));
    const purchase = page
      .locator(
        "#" +
          partId +
          ' a[data-purchase-channel="' +
          channel +
          '"][data-link-status="direct-product"]',
      )
      .first();
    await expect(purchase).toBeVisible();
    await purchase.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
    await purchase.click();
    const events = await page.evaluate(() =>
      JSON.parse(sessionStorage.getItem("qa-events") ?? "[]"),
    );
    expect(
      events.filter(
        (e: { name: string; params: { model_id: string } }) =>
          e.name === "search_model_selected" && e.params.model_id === modelId,
      ),
    ).toHaveLength(1);
    expect(
      events.filter(
        (e: { name: string; params: { model_id: string } }) =>
          e.name === "purchase_link_click" && e.params.model_id === modelId,
      ),
    ).toHaveLength(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
  await page.goto("/find?q=QA-NOT-REGISTERED-20261013");
  await expect(page.getByRole("heading", { name: "검색 결과를 찾지 못했습니다" })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.modelfitAnalyticsQueue?.filter((e) => e.name === "search_no_result").length,
      ),
    )
    .toBe(1);
  await expect(page.getByRole("link", { name: "모델 등록 요청" })).toBeVisible();
  const events = await page.evaluate(() => JSON.parse(sessionStorage.getItem("qa-events") ?? "[]"));
  await writeFile(
    "outputs/analytics/journey-test-events-" + testInfo.project.name + ".json",
    JSON.stringify(events, null, 2),
  );
});
