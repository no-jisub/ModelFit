import { expect, it } from "vitest";
import { summarizeAnalytics } from "../scripts/lib/analytics-report";

it("검색 결과 없음 비율과 모델별 클릭을 집계하며 전환을 추정하지 않는다", () => {
  const result = summarizeAnalytics([
    { name: "search_results_viewed", params: { result_count: 0 }, createdAt: "2026-10-04" },
    { name: "search_no_result", params: {}, createdAt: "2026-10-04" },
    { name: "search_results_viewed", params: { result_count: 12 }, createdAt: "2026-10-04" },
    { name: "model_page_view", params: { entity_id: "lg-test" }, createdAt: "2026-10-04" },
    { name: "purchase_link_click", params: { model_id: "lg-test" }, createdAt: "2026-10-04" },
  ]);
  expect(result.noResultRate).toBe(0.5);
  expect(result.byModel).toEqual([
    { modelId: "lg-test", pageViews: 1, evidenceClicks: 0, purchaseClicks: 1 },
  ]);
  expect(summarizeAnalytics([]).noResultRate).toBeNull();
});
