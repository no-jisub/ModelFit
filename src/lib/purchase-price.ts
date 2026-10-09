export const PRICE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export interface PurchasePriceSnapshot {
  linkId: string;
  linkUrl: string;
  productId: string;
  itemId: string;
  vendorItemId: string;
  amount: number;
  checkedAt: string;
}
export function isFreshPrice(
  snapshot: PurchasePriceSnapshot,
  url: string,
  now = Date.now(),
): boolean {
  const age = now - Date.parse(snapshot.checkedAt);
  return (
    snapshot.linkUrl === url &&
    Number.isSafeInteger(snapshot.amount) &&
    snapshot.amount > 0 &&
    age >= 0 &&
    age < PRICE_MAX_AGE_MS
  );
}
export function matchesPriceTarget(
  url: string,
  target: { priceProductId: string; priceItemId: string; priceVendorItemId: string },
): boolean {
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !["link.coupang.com", "www.coupang.com"].includes(parsed.hostname)
    )
      return false;
    return (
      (parsed.searchParams.get("pageKey") ?? parsed.pathname.match(/\/products\/(\d+)/)?.[1]) ===
        target.priceProductId &&
      parsed.searchParams.get("itemId") === target.priceItemId &&
      parsed.searchParams.get("vendorItemId") === target.priceVendorItemId
    );
  } catch {
    return false;
  }
}
