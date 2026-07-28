declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface SearchAnalyticsAdapter {
  trackSearch(query: string, resultCount: number): void;
  trackNoResult(query: string): void;
}

function sendEvent(name: string, params: Record<string, string | number> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export const analytics = {
  trackSearch(query: string, resultCount: number) {
    sendEvent("model_search", { search_term: query, result_count: resultCount });
  },
  trackNoResult(query: string) {
    sendEvent("search_no_result", { search_term: query });
  },
  trackModelVisit(modelCode: string) {
    sendEvent("model_page_visit", { model_code: modelCode });
  },
  trackPartClick(partId: string) {
    sendEvent("consumable_click", { part_id: partId });
  },
  trackAffiliateClick(kind: "genuine" | "compatible", partId: string) {
    sendEvent(`affiliate_${kind}_click`, { part_id: partId });
  },
  trackReportClick() {
    sendEvent("report_error_click");
  },
} satisfies SearchAnalyticsAdapter & Record<string, unknown>;
