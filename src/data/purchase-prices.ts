import { readFileSync } from "node:fs";
import { isFreshPrice, type PurchasePriceSnapshot } from "../lib/purchase-price";
import type { PurchaseLinkData } from "../types";
function loadFile(file: string): PurchasePriceSnapshot[] {
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    if (data.version === 1 && Array.isArray(data.prices))
      return data.prices.filter((p: unknown) => p !== null && typeof p === "object");
  } catch {
    /* Missing or failed collection leaves purchase links usable. */
  }
  return [];
}
function loadSnapshots() {
  return [
    ...loadFile("outputs/purchase-prices.json"),
    ...loadFile("outputs/official-purchase-prices.json"),
  ];
}
const snapshots = loadSnapshots();
export function getPurchasePrice(link: PurchaseLinkData) {
  const current = import.meta.env.DEV ? loadSnapshots() : snapshots;
  return current.find((p) => p.linkId === link.id && isFreshPrice(p, link.url));
}
