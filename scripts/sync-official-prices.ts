import { mkdir, writeFile, rename } from "node:fs/promises";
import { loadRawCatalog } from "./lib/catalog-schema";
import { extractOfficialPrice } from "./lib/official-price";
import type { PurchasePriceSnapshot } from "../src/lib/purchase-price";
const raw = await loadRawCatalog();
const prices: PurchasePriceSnapshot[] = [];
const statuses: { linkId: string; status: string }[] = [];
const allowedHosts = new Set([
  "www.lge.co.kr",
  "www.dyson.co.kr",
  "everybotmall.com",
  "www.winix.com",
  "www.cuckoo.co.kr",
]);
for (const target of raw["purchase-links.csv"].filter(
  (r) => r.isActive === "true" && r.channel === "official",
)) {
  const host = new URL(target.url).hostname;
  if (!allowedHosts.has(host)) {
    statuses.push({ linkId: target.id, status: "unsupported-store" });
    continue;
  }
  try {
    const response = await fetch(target.url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok || new URL(response.url).hostname !== host)
      throw new Error("store-unavailable");
    const html = await response.text();
    const amount = extractOfficialPrice(html);
    if (!amount) {
      statuses.push({ linkId: target.id, status: "unambiguous-price-not-found" });
      continue;
    }
    // LG's displayed offer is a member discount, not an unconditional selling price.
    const priceLabel = host === "www.lge.co.kr" ? "회원할인가" : "조회 가격";
    prices.push({
      linkId: target.id,
      linkUrl: target.url,
      productId: "",
      itemId: "",
      vendorItemId: "",
      amount,
      priceLabel,
      checkedAt: new Date().toISOString(),
    });
    statuses.push({ linkId: target.id, status: "updated" });
  } catch {
    statuses.push({ linkId: target.id, status: "collection-failed" });
  }
}
await mkdir("outputs", { recursive: true });
await writeFile(
  "outputs/official-purchase-prices.json.tmp",
  JSON.stringify({ version: 1, prices }, null, 2),
);
await rename("outputs/official-purchase-prices.json.tmp", "outputs/official-purchase-prices.json");
await writeFile("outputs/official-price-status.json", JSON.stringify(statuses, null, 2));
console.log(`공식몰 가격 갱신: ${prices.length}/${statuses.length}개`);
