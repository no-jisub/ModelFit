import { describe, expect, it } from "vitest";
import { isFreshPrice, matchesPriceTarget, PRICE_MAX_AGE_MS } from "../src/lib/purchase-price";
const now = Date.parse("2026-10-09T00:00:00Z");
const snapshot = {
  linkId: "one",
  linkUrl: "https://link.coupang.com/a/one",
  productId: "1",
  itemId: "2",
  vendorItemId: "3",
  amount: 10000,
  checkedAt: new Date(now - 1000).toISOString(),
};
describe("purchase prices", () => {
  it("hides stale, future, changed-link and invalid amounts", () => {
    expect(isFreshPrice(snapshot, snapshot.linkUrl, now)).toBe(true);
    expect(isFreshPrice(snapshot, "https://link.coupang.com/a/two", now)).toBe(false);
    for (const checkedAt of [
      "bad",
      new Date(now + 1).toISOString(),
      new Date(now - PRICE_MAX_AGE_MS).toISOString(),
    ])
      expect(isFreshPrice({ ...snapshot, checkedAt }, snapshot.linkUrl, now)).toBe(false);
    for (const amount of [0, -1, NaN, 1.5])
      expect(isFreshPrice({ ...snapshot, amount }, snapshot.linkUrl, now)).toBe(false);
  });
  it("never substitutes a different seller or variation of the same product", () => {
    const target = { priceProductId: "1", priceItemId: "2", priceVendorItemId: "3" };
    expect(
      matchesPriceTarget(
        "https://link.coupang.com/re/AFFSDP?pageKey=1&itemId=2&vendorItemId=3",
        target,
      ),
    ).toBe(true);
    for (const url of [
      "https://link.coupang.com/re/AFFSDP?pageKey=1&itemId=4&vendorItemId=3",
      "https://link.coupang.com/re/AFFSDP?pageKey=1&itemId=2&vendorItemId=4",
      "https://link.coupang.com/re/AFFSDP?pageKey=1",
      "https://example.com/?pageKey=1&itemId=2&vendorItemId=3",
    ])
      expect(matchesPriceTarget(url, target)).toBe(false);
  });
});
