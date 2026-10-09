import { createHmac } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { loadRawCatalog } from "./lib/catalog-schema";
import { matchesPriceTarget, type PurchasePriceSnapshot } from "../src/lib/purchase-price";

// Build-time only: keys and raw API responses are never shipped to the browser.
const local = await readFile(".env", "utf8")
  .then(parseEnv)
  .catch(() => ({}) as Record<string, string>);
const access = (process.env.COUPANG_ACCESS_KEY ?? local.COUPANG_ACCESS_KEY ?? "").trim();
const secret = (process.env.COUPANG_SECRET_KEY ?? local.COUPANG_SECRET_KEY ?? "").trim();
const raw = await loadRawCatalog();
const targets = raw["purchase-links.csv"].filter((r) => r.isActive === "true" && r.priceKeyword);
const prices: PurchasePriceSnapshot[] = [];
const outcomes: { linkId: string; status: string }[] = [];
const cache = new Map<string, Record<string, unknown>[]>();
for (const target of targets) {
  if (!access || !secret) {
    outcomes.push({ linkId: target.id, status: "missing-credentials" });
    continue;
  }
  try {
    let products = cache.get(target.priceKeyword);
    if (!products) {
      const endpoint = "/v2/providers/affiliate_open_api/apis/openapi/products/search";
      const query = new URLSearchParams({ keyword: target.priceKeyword, limit: "10" }).toString();
      const date = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")
        .slice(2);
      const signature = createHmac("sha256", secret)
        .update(date + "GET" + endpoint + query)
        .digest("hex");
      const response = await fetch("https://api-gateway.coupang.com" + endpoint + "?" + query, {
        headers: {
          Authorization: `CEA algorithm=HmacSHA256, access-key=${access}, signed-date=${date}, signature=${signature}`,
        },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error("http");
      const data = await response.json();
      if (String(data.rCode) !== "0" || !Array.isArray(data.data?.productData))
        throw new Error("api");
      products = data.data.productData;
      cache.set(target.priceKeyword, products!);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    const product = products!.find(
      (p) =>
        String(p.productId) === target.priceProductId &&
        matchesPriceTarget(
          String(p.productUrl),
          target as { priceProductId: string; priceItemId: string; priceVendorItemId: string },
        ),
    );
    const amount = product?.productPrice;
    if (typeof amount !== "number" || !Number.isSafeInteger(amount) || amount <= 0) {
      outcomes.push({ linkId: target.id, status: "exact-option-not-found" });
      continue;
    }
    prices.push({
      linkId: target.id,
      linkUrl: target.url,
      productId: target.priceProductId,
      itemId: target.priceItemId,
      vendorItemId: target.priceVendorItemId,
      amount,
      checkedAt: new Date().toISOString(),
    });
    outcomes.push({ linkId: target.id, status: "updated" });
  } catch {
    outcomes.push({ linkId: target.id, status: "collection-failed" });
  }
}
await mkdir("outputs", { recursive: true });
// Always overwrite: never carry stale or unmatched prices across collection failures.
await writeFile("outputs/purchase-prices.json", JSON.stringify({ version: 1, prices }, null, 2));
await writeFile("outputs/purchase-price-status.json", JSON.stringify(outcomes, null, 2));
console.log(`가격 갱신: ${prices.length}/${targets.length} 개 (미확인 가격은 숨김)`);
