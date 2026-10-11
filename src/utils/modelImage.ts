// These are the existing catalog's image origins, also permitted by Hosting's CSP.
const existingImageHosts = new Set([
  "ads-partners.coupang.com",
  "cdn.cuckoo.co.kr",
  "cdn.shopify.com",
  "kr.object.ncloudstorage.com",
  "prod3-sprcdn-assets.sprinklr.com",
  "qr.everybot.kr",
  "store.kr.dreametech.com",
  "www.irobot.co.uk",
]);
export function canDisplayModelImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      (existingImageHosts.has(url.hostname) || url.hostname.endsWith(".coupangcdn.com"))
    );
  } catch {
    return false;
  }
}
