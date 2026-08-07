export type AnalyticsParams = Record<string, string | number | boolean>;

export interface AnalyticsQueueItem {
  name: string;
  params: AnalyticsParams;
  createdAt: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    modelfitAnalyticsQueue?: AnalyticsQueueItem[];
  }
}

export interface SearchAnalyticsAdapter {
  trackSearch(query: string, resultCount: number): void;
  trackNoResult(query: string): void;
}

export function sendAnalyticsEvent(name: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;

  const event = { name, params, createdAt: new Date().toISOString() };
  window.modelfitAnalyticsQueue ??= [];
  window.modelfitAnalyticsQueue.push(event);
  window.dispatchEvent(new CustomEvent("modelfit:analytics", { detail: event }));

  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

function destinationHost(anchor: HTMLAnchorElement) {
  try {
    return new URL(anchor.href).hostname;
  } catch {
    return "";
  }
}

export function bindAnalyticsInteractions(): () => void {
  if (typeof document === "undefined") return () => undefined;

  const entityType = document.body.dataset.entityType;
  const entityId = document.body.dataset.entityId;
  if ((entityType === "model" || entityType === "part") && entityId) {
    analytics.trackEntityPageView(entityType, entityId);
  }

  const onClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;

    const partId = anchor.dataset.partId ?? "";
    const affiliateKind = anchor.dataset.affiliateKind;
    const sourceType = anchor.dataset.sourceType;
    const reportChannel = anchor.dataset.reportChannel;
    const url = new URL(anchor.href, window.location.origin);

    if (affiliateKind === "genuine" || affiliateKind === "compatible") {
      analytics.trackAffiliateClick(affiliateKind, partId, anchor.dataset.linkStatus ?? "unknown");
      return;
    }

    if (sourceType) {
      analytics.trackSourceClick(sourceType, partId, destinationHost(anchor));
      return;
    }

    if (reportChannel) {
      analytics.trackReportSubmit(reportChannel);
      return;
    }

    if (url.origin === window.location.origin && url.pathname.startsWith("/part/")) {
      analytics.trackPartClick(url.pathname.split("/").filter(Boolean)[1] ?? "unknown");
    }

    if (url.origin === window.location.origin && url.pathname.startsWith("/report")) {
      analytics.trackReportClick();
    }
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

export const analytics = {
  trackSearch(query: string, resultCount: number) {
    sendAnalyticsEvent("search_results_viewed", {
      search_term: query,
      result_count: resultCount,
    });
  },
  trackSearchSubmit(query: string, placement: "header" | "page" | "popular") {
    sendAnalyticsEvent("search_submitted", { search_term: query, placement });
  },
  trackNoResult(query: string) {
    sendAnalyticsEvent("search_no_result", { search_term: query });
  },
  trackAutocompleteSelect(
    query: string,
    resultType: "model" | "part",
    resultId: string,
    position: number,
  ) {
    sendAnalyticsEvent("autocomplete_selected", {
      search_term: query,
      result_type: resultType,
      result_id: resultId,
      position,
    });
  },
  trackRelatedResults(open: boolean, modelCount: number, partCount: number) {
    sendAnalyticsEvent("related_results_toggled", {
      state: open ? "open" : "closed",
      model_count: modelCount,
      part_count: partCount,
    });
  },
  trackEntityPageView(entityType: "model" | "part", entityId: string) {
    sendAnalyticsEvent(`${entityType}_page_view`, { entity_id: entityId });
  },
  trackPartClick(partId: string) {
    sendAnalyticsEvent("consumable_click", { part_id: partId });
  },
  trackSourceClick(sourceType: string, partId: string, destination: string) {
    sendAnalyticsEvent("official_source_click", {
      source_type: sourceType,
      part_id: partId || "not-set",
      destination,
    });
  },
  trackAffiliateClick(kind: "genuine" | "compatible", partId: string, linkStatus: string) {
    sendAnalyticsEvent("purchase_link_click", {
      channel: "coupang",
      product_kind: kind,
      part_id: partId,
      link_status: linkStatus,
    });
  },
  trackReportClick() {
    sendAnalyticsEvent("report_error_click");
  },
  trackReportSubmit(channel: string) {
    sendAnalyticsEvent("report_error_submit", { channel });
  },
} satisfies SearchAnalyticsAdapter & Record<string, unknown>;
