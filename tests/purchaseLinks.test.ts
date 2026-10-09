import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
describe("normalized option links", () => {
  it("preserves approved affiliate destination on the product option", () => {
    const part = consumables.find((p) => p.id === "lg-puricare-m-filter")!;
    expect(part.productOptions.flatMap((o) => o.purchaseLinks)).toContainEqual(
      expect.objectContaining({
        channel: "coupang",
        url: "https://link.coupang.com/a/hHPSpGT79w",
        isAffiliate: true,
        linkType: "direct-product",
      }),
    );
    expect(part).not.toHaveProperty("purchaseLinks");
  });
  it("separates guidance from actual purchases and never generates search URLs", () => {
    const options = consumables.flatMap((p) => p.productOptions);
    expect(options.flatMap((o) => o.purchaseLinks)).toHaveLength(164);
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
      ["xiaomi-x10-plus-main-brush", "https://link.coupang.com/a/hC9ARzuMp2", true],
      ["xiaomi-x20-plus-main-brush", "https://link.coupang.com/a/hC9ARzuMp2", true],
      ["xiaomi-x10-plus-side-brush", "https://www.coupang.com/vp/products/8305225725", false],
      ["xiaomi-x20-plus-side-brush", "https://www.coupang.com/vp/products/8305225725", false],
      ["xiaomi-x10-plus-dust-bag", "https://link.coupang.com/a/hC9BEDlMbY", true],
    ] as const;
    for (const [id, url, isAffiliate] of replacements) {
      const options = consumables.find((part) => part.id === id)!.productOptions;
      const available = options.filter((option) => option.purchaseLinks.length);
      expect(available).toHaveLength(1);
      expect(available[0].verification).toBe("seller-claimed");
      expect(available[0].purchaseLinks[0]).toMatchObject({
        channel: "coupang",
        isAffiliate,
        url,
      });
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
    expect(links.some((l) => !l.isAffiliate && l.url.includes("/vp/products/8305225725"))).toBe(
      true,
    );
    expect(links.every((l) => !Number.isNaN(Date.parse(l.checkedAt)))).toBe(true);
    expect(
      links
        .filter((l) => l.isAffiliate)
        .every((l) => l.url.startsWith("https://link.coupang.com/a/")),
    ).toBe(true);
  });
  it("offers verified official products when the old individual Coupang item cannot be confirmed", () => {
    for (const [partId, url] of [
      ["cuckoo-acf-tmt20-filter", "https://www.cuckoo.co.kr/mall/productView?productNo=9038"],
      ["winix-zero-s-deodorizing-filter", "https://www.winix.com/product/2"],
    ]) {
      const options = consumables.find((part) => part.id === partId)!.productOptions;
      const available = options.filter((option) => option.purchaseLinks.length);
      expect(available).toHaveLength(1);
      expect(available[0].kind).toBe("genuine");
      expect(available[0].purchaseLinks[0]).toMatchObject({
        url,
        channel: "official",
        isAffiliate: false,
        purchaseScope: "individual",
        checkedAt: "2026-10-09",
      });
    }
  });
  it("labels the verified third-party Xiaomi dust bag as a compatible ten-pack", () => {
    const options = consumables.find(
      (part) => part.id === "xiaomi-x20-plus-dust-bag",
    )!.productOptions;
    const available = options.filter((option) => option.purchaseLinks.length);
    expect(available).toHaveLength(1);
    expect(available[0]).toMatchObject({
      kind: "compatible",
      verification: "seller-claimed",
      packageLabel: "먼지봉투 10개",
    });
    expect(
      options.some((option) => option.kind === "genuine" && option.purchaseLinks.length === 0),
    ).toBe(true);
  });
  it("uses reviewed affiliate replacements for the G filter and three-spin mop set", () => {
    for (const [partId, url] of [
      ["lg-puricare-g-filter", "https://link.coupang.com/a/hHPSANYFfU"],
      ["everybot-three-spin-yarn-mop", "https://link.coupang.com/a/hC9HsbJcsK"],
    ]) {
      const links = consumables
        .find((part) => part.id === partId)!
        .productOptions.flatMap((option) => option.purchaseLinks);
      expect(links).toContainEqual(
        expect.objectContaining({
          url,
          channel: "coupang",
          isAffiliate: true,
          checkedAt: partId === "lg-puricare-g-filter" ? "2026-10-09" : "2026-10-06",
        }),
      );
    }
  });
});
