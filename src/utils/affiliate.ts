export function buildAffiliateUrl(baseUrl: string | undefined, keyword: string): string | null {
  if (!baseUrl || !keyword.trim()) return null;

  try {
    const url = new URL(baseUrl);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    url.searchParams.set("q", keyword.trim());
    return url.toString();
  } catch {
    return null;
  }
}
