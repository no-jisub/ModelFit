import { createHmac } from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { loadRawCatalog } from "./lib/catalog-schema";
import { matchesPriceTarget, type PurchasePriceSnapshot } from "../src/lib/purchase-price";

// Scheduled collection before deployment; never ship keys or raw responses to the browser.
const local = await readFile(".env", "utf8")
  .then(parseEnv)
  .catch(() => ({}) as Record<string, string>);
const access = (process.env.COUPANG_ACCESS_KEY ?? local.COUPANG_ACCESS_KEY ?? "").trim();
const secret = (process.env.COUPANG_SECRET_KEY ?? local.COUPANG_SECRET_KEY ?? "").trim();
const raw = await loadRawCatalog();
const targets = raw["purchase-links.csv"].filter(
  (r) => r.isActive === "true" && r.channel === "coupang" && r.priceKeyword,
);
if (process.argv.includes("--dry-run")) {
  console.log(
    `가격 갱신 대상: ${targets.length}개, 검색어 ${new Set(targets.map((t) => t.priceKeyword)).size}개 (API 호출 없음)`,
  );
  console.log(`API 인증 설정: ${access && secret ? "준비됨" : "누락"}`);
  process.exit(0);
}
if (targets.length > 0 && (!access || !secret)) {
  throw new Error("가격 갱신에 필요한 COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY 설정이 없습니다.");
}
const prices: PurchasePriceSnapshot[] = [];
const outcomes: { linkId: string; status: string }[] = [];
const cache = new Map<string, Record<string, unknown>[]>();
const failedKeywords = new Set<string>();
let stopReason: string | undefined;
let nextRequestAt = 0;
for (const target of targets) {
  if (stopReason || failedKeywords.has(target.priceKeyword)) {
    outcomes.push({ linkId: target.id, status: stopReason ?? "collection-failed" });
    continue;
  }
  try {
    let products = cache.get(target.priceKeyword);
    if (!products) {
      await new Promise((resolve) => setTimeout(resolve, Math.max(0, nextRequestAt - Date.now())));
      // Throttle failed requests too; an API error must not trigger a burst of retries.
      nextRequestAt = Date.now() + 2000;
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
      if (!response.ok) {
        if (response.status === 429) stopReason = "rate-limited";
        if (response.status === 401 || response.status === 403)
          stopReason = "authentication-failed";
        throw new Error("http");
      }
      const data = await response.json();
      if (String(data.rCode) !== "0" || !Array.isArray(data.data?.productData))
        throw new Error("api");
      products = data.data.productData;
      cache.set(target.priceKeyword, products!);
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
    failedKeywords.add(target.priceKeyword);
    outcomes.push({ linkId: target.id, status: stopReason ?? "collection-failed" });
  }
}
await mkdir("outputs", { recursive: true });
// Always overwrite: never carry stale or unmatched prices across collection failures.
await writeFile(
  "outputs/purchase-prices.json.tmp",
  JSON.stringify({ version: 1, prices }, null, 2),
);
await rename("outputs/purchase-prices.json.tmp", "outputs/purchase-prices.json");
await writeFile("outputs/purchase-price-status.json", JSON.stringify(outcomes, null, 2));
const counts = outcomes.reduce<Record<string, number>>((totals, result) => {
  totals[result.status] = (totals[result.status] ?? 0) + 1;
  return totals;
}, {});
const summary =
  [
    "## 상품 가격 갱신",
    `갱신 ${prices.length}개 / 대상 ${targets.length}개`,
    ...Object.entries(counts).map(([status, count]) => `- ${status}: ${count}개`),
  ].join("\n") + "\n";
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(`가격 갱신: ${prices.length}/${targets.length} 개 (미확인 가격은 숨김)`);
if (stopReason || (counts["collection-failed"] && prices.length === 0)) {
  process.exitCode = 1;
  console.error("API 오류로 가격 갱신을 완료하지 못했습니다. 자동 배포를 중단합니다.");
}
