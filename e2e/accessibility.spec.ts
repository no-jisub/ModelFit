import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "홈", path: "/" },
  { name: "검색", path: "/find?q=ADQ30041405" },
  { name: "공기청정기 카테고리", path: "/category/air-purifier" },
  { name: "모델 상세", path: "/model/lg/as355nsna" },
];

for (const route of routes) {
  test(`${route.name}에 치명·중대 접근성 위반이 없다`, async ({ page }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const seriousViolations = results.violations.filter(
      ({ impact }) => impact === "critical" || impact === "serious",
    );

    expect(seriousViolations, JSON.stringify(seriousViolations, null, 2)).toEqual([]);
  });
}
