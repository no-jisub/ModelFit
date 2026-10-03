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
    expect(options.flatMap((o) => o.purchaseLinks)).toHaveLength(153);
    expect(options.flatMap((o) => o.guidanceLinks)).toHaveLength(177);
    const activeLinkIds = options.flatMap((o) => o.purchaseLinks.map((link) => link.id));
    expect(activeLinkIds).not.toContain("xiaomi-x20-plus-main-brush-coupang");
    expect(activeLinkIds).not.toContain("xiaomi-x20-plus-side-brush-coupang");
    expect(activeLinkIds).not.toContain("xiaomi-x10-plus-main-brush-coupang");
    expect(activeLinkIds).not.toContain("xiaomi-x10-plus-side-brush-coupang");
    expect(activeLinkIds).not.toContain("xiaomi-x10-plus-dust-bag-coupang");
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
  it("replaces mismatched Xiaomi destinations and adds domestic official stores", () => {
    const replacements = [
      ["xiaomi-x10-plus-main-brush", "8518462768"],
      ["xiaomi-x20-plus-main-brush", "8518462768"],
      ["xiaomi-x10-plus-side-brush", "8305225725"],
      ["xiaomi-x20-plus-side-brush", "8305225725"],
      ["xiaomi-x10-plus-dust-bag", "8518458631"],
    ];
    for (const [id, productId] of replacements) {
      const options = consumables.find((part) => part.id === id)!.productOptions;
      const available = options.filter((option) => option.purchaseLinks.length);
      expect(available).toHaveLength(1);
      expect(available[0].verification).toBe("seller-claimed");
      expect(available[0].purchaseLinks[0]).toMatchObject({
        channel: "coupang",
        isAffiliate: false,
      });
      expect(new URL(available[0].purchaseLinks[0].url).pathname).toBe("/vp/products/" + productId);
    }
    for (const id of [
      "dyson-360-glass-hepa-carbon-filter",
      "everybot-q11-filter",
      "everybot-q11-side-brush",
      "everybot-q11-dust-bag",
    ]) {
      const links = consumables
        .find((part) => part.id === id)!
        .productOptions.flatMap((option) => option.purchaseLinks);
      expect(links).toHaveLength(1);
      expect(links[0]).toMatchObject({ channel: "official", isAffiliate: false });
    }
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
