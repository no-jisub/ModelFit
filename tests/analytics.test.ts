import { afterEach, describe, expect, it, vi } from "vitest";
import { analytics, sendAnalyticsEvent } from "../src/utils/analytics";

class TestCustomEvent<T> {
  constructor(
    public type: string,
    public init: { detail: T },
  ) {}
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("analytics", () => {
  it("keeps events locally when GA4 is not configured", () => {
    const dispatchEvent = vi.fn();
    const browserWindow: {
      dispatchEvent: typeof dispatchEvent;
      modelfitAnalyticsQueue?: unknown[];
    } = { dispatchEvent };
    vi.stubGlobal("window", browserWindow);
    vi.stubGlobal("CustomEvent", TestCustomEvent);

    sendAnalyticsEvent("search_submitted", { search_term: "S8" });

    expect(browserWindow.modelfitAnalyticsQueue).toMatchObject([
      { name: "search_submitted", params: { search_term: "S8" } },
    ]);
    expect(dispatchEvent).toHaveBeenCalledOnce();
  });

  it("forwards the same event to GA4 when gtag is available", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { dispatchEvent: vi.fn(), gtag });
    vi.stubGlobal("CustomEvent", TestCustomEvent);

    analytics.trackAffiliateClick("genuine", "sample-part", "direct-product");

    expect(gtag).toHaveBeenCalledWith("event", "purchase_link_click", {
      channel: "coupang",
      product_kind: "genuine",
      part_id: "sample-part",
      link_status: "direct-product",
    });
  });
});
