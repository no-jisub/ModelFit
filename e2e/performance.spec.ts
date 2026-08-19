import { expect, test } from "@playwright/test";

const budgets = [
  { name: "홈", path: "/", maxResources: 30, maxTransferBytes: 750_000 },
  {
    name: "모델 상세",
    path: "/model/lg/as355nsna",
    maxResources: 30,
    maxTransferBytes: 750_000,
  },
];

for (const budget of budgets) {
  test(`${budget.name}이 성능 예산을 지킨다`, async ({ page }) => {
    await page.goto(budget.path, { waitUntil: "networkidle" });

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

      return {
        domContentLoadedMs: navigation.domContentLoadedEventEnd,
        resourceCount: resources.length,
        transferBytes:
          navigation.transferSize +
          resources.reduce((total, entry) => total + entry.transferSize, 0),
        domNodes: document.getElementsByTagName("*").length,
      };
    });

    expect(metrics.domContentLoadedMs).toBeLessThan(3_000);
    expect(metrics.resourceCount).toBeLessThanOrEqual(budget.maxResources);
    expect(metrics.transferBytes).toBeLessThanOrEqual(budget.maxTransferBytes);
    expect(metrics.domNodes).toBeLessThanOrEqual(1_200);
  });
}
