import { readFileSync } from "node:fs";
import { isFreshPrice, type PurchasePriceSnapshot } from "../lib/purchase-price";
import type { PurchaseLinkData } from "../types";
let snapshots: PurchasePriceSnapshot[] = [];
try {
  const data = JSON.parse(readFileSync("outputs/purchase-prices.json", "utf8"));
  if (data.version === 1 && Array.isArray(data.prices))
    snapshots = data.prices.filter((p: unknown) => p !== null && typeof p === "object");
} catch {
  /* Missing or failed collection leaves purchase links usable. */
}
export function getPurchasePrice(link: PurchaseLinkData) {
  return snapshots.find((p) => p.linkId === link.id && isFreshPrice(p, link.url));
}
