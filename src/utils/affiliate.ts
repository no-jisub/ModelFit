export const DEFAULT_COUPANG_SEARCH_URL = "https://www.coupang.com/np/search";

export function buildAffiliateUrl(baseUrl: string | undefined, keyword: string): string | null {
  if (!keyword.trim()) return null;

  try {
    const url = new URL(baseUrl?.trim() || DEFAULT_COUPANG_SEARCH_URL);
    if (
      url.protocol !== "https:" ||
      !(url.hostname === "coupang.com" || url.hostname.endsWith(".coupang.com"))
    ) {
      return null;
    }
    url.searchParams.set("q", keyword.trim());
    return url.toString();
  } catch {
    return null;
  }
}
