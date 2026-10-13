import type { AnalyticsQueueItem } from "../../src/utils/analytics";

export function summarizeAnalytics(events: AnalyticsQueueItem[]) {
  const count = (name: string) => events.filter((event) => event.name === name).length;
  const searches = events.filter((event) => event.name === "search_results_viewed");
  const emptySearches = searches.filter((event) => event.params.result_count === 0).length;
  const terms = new Map<string, { resultViews: number; noResultViews: number }>();
  for (const event of searches) {
    const term =
      typeof event.params.search_term === "string" ? event.params.search_term.trim() : "";
    if (!term) continue;
    const row = terms.get(term) ?? { resultViews: 0, noResultViews: 0 };
    row.resultViews += 1;
    if (event.params.result_count === 0) row.noResultViews += 1;
    terms.set(term, row);
  }
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
    searchTerms: [...terms]
      .map(([term, counts]) => ({ term, ...counts }))
      .sort((a, b) => b.resultViews - a.resultViews || a.term.localeCompare(b.term)),
    noResultTerms: [...terms]
      .filter(([, counts]) => counts.noResultViews > 0)
      .map(([term, counts]) => ({ term, views: counts.noResultViews }))
      .sort((a, b) => b.views - a.views || a.term.localeCompare(b.term)),
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
