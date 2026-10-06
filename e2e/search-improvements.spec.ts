import { expect, test } from "@playwright/test";
import { models } from "../src/data/models";
import { consumables } from "../src/data/consumables";
import { searchCatalog } from "../src/utils/searchCatalog";

test("브랜드 검색은 모델 우선, 사용자가 지정한 소모품 탭은 유지", async ({ page }) => {
  await page.goto("/find?q=로보락");
  await expect(page.getByRole("tab", { name: "모델", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.goto("/find?q=로보락&type=parts");
  await expect(page.getByRole("tab", { name: "소모품", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("소모품 전체 결과에 접근하고 필터 변경 후 표시 개수가 초기화된다", async ({ page }) => {
  const expected = searchCatalog(models, consumables, "필터").consumables;
  await page.goto("/find?q=필터");
  await expect(page.locator(".results-summary")).toHaveText(`검색 결과 ${expected.length}개`);
  const more = page.getByRole("button", { name: "소모품 더 보기", exact: true });
  while (await more.isVisible()) await more.click();
  const related = page.locator("#part-results-panel .related-results");
  if (await related.count()) {
    await related.locator("summary").click();
    const relatedMore = page.getByRole("button", { name: "관련 소모품 더 불러오기" });
    while (await relatedMore.isVisible()) await relatedMore.click();
  }
  await expect(page.locator(".search-part-card")).toHaveCount(expected.length);
  const ids = await page
    .locator(".search-part-card")
    .evaluateAll((items) => items.map((item) => item.id));
  expect(new Set(ids).size).toBe(expected.length);
  await page.getByLabel("브랜드", { exact: true }).selectOption("lg");
  await page.getByRole("button", { name: "필터 전체 해제" }).click();
  await expect(page.locator("#part-results-panel .result-group .search-part-card")).toHaveCount(
    Math.min(12, expected.filter((item) => item.score === expected[0].score).length),
  );
});

test("모델번호 안내를 누르면 실제 라벨 안내가 열린다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");
  await page.getByRole("link", { name: "모델번호 확인 방법", exact: true }).click();
  await expect(page.locator("#model-number-guide")).toHaveAttribute("open", "");
  await expect(page.locator("#model-number-guide")).toContainText("이 모델의 라벨 위치");
});

test("미확인 모델은 등록 수와 공식 확인 수를 구분한다", async ({ page }) => {
  await page.goto("/model/coway/ap-4025d");
  await expect(page.locator(".model-compatibility-summary")).toContainText("공식 호환 확인 0개");
  await expect(page.locator(".part-evidence-summary")).toHaveCount(0);
});

test("공식 근거와 구매 이벤트에 모델 ID가 있으며 중복 기록하지 않는다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");
  const evidence = page.locator(".part-evidence-summary a").first();
  await evidence.evaluate((a) => a.addEventListener("click", (event) => event.preventDefault()));
  await evidence.click();
  const purchase = page.locator('a[data-link-status="direct-product"]').first();
  await purchase.evaluate((a) => a.addEventListener("click", (event) => event.preventDefault()));
  await purchase.click();
  const events = await page.evaluate(() => window.modelfitAnalyticsQueue);
  for (const name of ["official_source_click", "purchase_link_click"]) {
    const matched = events?.filter((event) => event.name === name);
    expect(matched).toHaveLength(1);
    expect(matched?.[0].params.model_id).toBe("lg-as355nsna");
  }
});
