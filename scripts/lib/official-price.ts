// Accept a single explicit KRW offer, never an aggregate range or recommendation price.
export function extractOfficialPrice(html: string) {
  const products: Record<string, any>[] = [];
  function visit(value: any) {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") {
      if (value["@type"] === "Product") products.push(value);
      if (value["@graph"]) visit(value["@graph"]);
    }
  }
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      visit(JSON.parse(match[1]));
    } catch {
      /* Ignore invalid structured data. */
    }
  }
  if (products.length !== 1) return undefined;
  const offer = products[0].offers;
  if (!offer || Array.isArray(offer) || offer["@type"] !== "Offer" || offer.priceCurrency !== "KRW")
    return undefined;
  if (offer.availability && !String(offer.availability).endsWith("/InStock")) return undefined;
  const amount = Number(offer.price);
  return Number.isSafeInteger(amount) && amount > 0 ? amount : undefined;
}
