import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
describe("normalized option links", () => {
  it("preserves approved affiliate destination on the product option", () => {
    const part = consumables.find((p) => p.id === "lg-puricare-m-filter")!;
    expect(part.productOptions.flatMap((o) => o.purchaseLinks)).toContainEqual(
      expect.objectContaining({
        channel: "coupang",
        url: "https://link.coupang.com/a/gDwSqU3CAC",
        isAffiliate: true,
        linkType: "direct-product",
      }),
    );
    expect(part).not.toHaveProperty("purchaseLinks");
  });
  it("separates guidance from actual purchases and never generates search URLs", () => {
    const options = consumables.flatMap((p) => p.productOptions);
    expect(options.flatMap((o) => o.purchaseLinks)).toHaveLength(149);
    expect(options.flatMap((o) => o.guidanceLinks)).toHaveLength(177);
    expect(
      options
        .flatMap((o) => o.purchaseLinks)
        .every((l) => l.linkType === "direct-product" && new URL(l.url).protocol === "https:"),
    ).toBe(true);
    expect(
      options.flatMap((o) => o.guidanceLinks).every((l) => l.linkType === "official-reference"),
    ).toBe(true);
    expect(options.some((o) => o.purchaseLinks.length === 0 && o.guidanceLinks.length > 0)).toBe(
      true,
    );
  });
  it("preserves non-affiliate product URLs and link check dates", () => {
    const links = consumables.flatMap((p) => p.productOptions.flatMap((o) => o.purchaseLinks));
    expect(links.some((l) => !l.isAffiliate && l.url.includes("/vp/products/8941845170"))).toBe(
      true,
    );
    expect(links.every((l) => !Number.isNaN(Date.parse(l.checkedAt)))).toBe(true);
    expect(
      links
        .filter((l) => l.isAffiliate)
        .every((l) => l.url.startsWith("https://link.coupang.com/a/")),
    ).toBe(true);
  });
});
