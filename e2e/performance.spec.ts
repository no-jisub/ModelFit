import { expect, test } from "@playwright/test";

const budgets = [
  { name: "홈", path: "/", maxResources: 30, maxTransferBytes: 750_000 },
  { name: "검색", path: "/find?q=필터", maxResources: 35, maxTransferBytes: 900_000 },
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

test("검색 UI JavaScript에 전체 카탈로그가 포함되지 않는다", async ({ page }) => {
  let scriptBytes = 0;
  const responses: Promise<void>[] = [];
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.startsWith("/_astro/") && response.url().endsWith(".js")) {
      responses.push(
        response.body().then((body) => {
          scriptBytes += body.byteLength;
        }),
      );
    }
  });
  await page.goto("/find?q=AS355NSNA", { waitUntil: "networkidle" });
  await Promise.all(responses);
  // Includes the React DOM runtime (~184 KB), shared code and both search components.
  expect(scriptBytes).toBeLessThan(250_000);
  await expect(page.locator(".search-page-app")).toHaveAttribute("data-ready", "true");
});
