import { describe, it, expect } from "vitest";
import { extractOfficialPrice } from "../scripts/lib/official-price";
const page = (offer: object) =>
  `<script type="application/ld+json">${JSON.stringify({ "@type": "Product", offers: offer })}</script>`;
describe("official store price", () => {
  const offer = {
    "@type": "Offer",
    priceCurrency: "KRW",
    price: "76000",
    availability: "https://schema.org/InStock",
  };
  it("accepts a single explicit in-stock KRW offer", () =>
    expect(extractOfficialPrice(page(offer))).toBe(76000));
  it("rejects foreign currencies, ranges, unavailable products and invalid amounts", () => {
    for (const patch of [
      { priceCurrency: "EUR" },
      { "@type": "AggregateOffer", lowPrice: "10" },
      { availability: "https://schema.org/OutOfStock" },
      { price: "0" },
      { price: "-1" },
      { price: "1.5" },
    ])
      expect(extractOfficialPrice(page({ ...offer, ...patch }))).toBeUndefined();
  });
  it("rejects ambiguous product and option lists", () => {
    expect(extractOfficialPrice(page(offer) + page(offer))).toBeUndefined();
    expect(extractOfficialPrice(page([offer, offer]))).toBeUndefined();
  });
});
