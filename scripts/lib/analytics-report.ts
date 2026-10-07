import type { AnalyticsQueueItem } from "../../src/utils/analytics";

export function summarizeAnalytics(events: AnalyticsQueueItem[]) {
  const count = (name: string) => events.filter((event) => event.name === name).length;
  const searches = events.filter((event) => event.name === "search_results_viewed");
  const emptySearches = searches.filter((event) => event.params.result_count === 0).length;
  const modelIds = new Set(
    events.flatMap((event) => {
      const id = event.name === "model_page_view" ? event.params.entity_id : event.params.model_id;
      return typeof id === "string" && id !== "not-set" ? [id] : [];
    }),
  );
  return {
    eventCount: events.length,
    searchResultViews: searches.length,
    emptySearches,
    noResultRate: searches.length ? emptySearches / searches.length : null,
    modelSelections:
      count("search_model_selected") +
      events.filter(
        (event) => event.name === "autocomplete_selected" && event.params.result_type === "model",
      ).length,
    modelPageViews: count("model_page_view"),
    evidenceClicks: count("official_source_click"),
    purchaseLinkClicks: count("purchase_link_click"),
    byModel: [...modelIds].sort().map((modelId) => ({
      modelId,
      pageViews: events.filter(
        (event) => event.name === "model_page_view" && event.params.entity_id === modelId,
      ).length,
      evidenceClicks: events.filter(
        (event) => event.name === "official_source_click" && event.params.model_id === modelId,
      ).length,
      purchaseClicks: events.filter(
        (event) => event.name === "purchase_link_click" && event.params.model_id === modelId,
      ).length,
    })),
  };
}
