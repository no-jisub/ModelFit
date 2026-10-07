import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import {
  groupPurchaseOptions,
  getSalesPackageLabel,
  getPurchaseBundles,
} from "../src/utils/purchasePresentation";
import type { ConsumableProductOption } from "../src/types";

function option(
  id: string,
  verification: ConsumableProductOption["verification"],
  kind: ConsumableProductOption["kind"],
  purchase: boolean,
  affiliate = false,
): ConsumableProductOption {
  const base = structuredClone(
    consumables.flatMap((p) => p.productOptions).find((o) => o.purchaseLinks.length)!,
  );
  return {
    ...base,
    id,
    verification,
    kind,
    purchaseLinks: purchase
      ? base.purchaseLinks.map((link) => ({ ...link, isAffiliate: affiliate }))
      : [],
  };
}
describe("purchase option ordering", () => {
  it("shows verified available offers first and separates unavailable official references", () => {
    const options = [
      option("reference", "official-genuine", "genuine", false),
      option("seller", "seller-claimed", "genuine", true),
      option("compatible", "verified-compatible", "compatible", true),
      option("official", "official-genuine", "genuine", true),
    ];
    const before = structuredClone(options);
    const groups = groupPurchaseOptions(options);
    expect(groups.available.map((o) => o.id)).toEqual(["official", "compatible", "seller"]);
    expect(groups.reference.map((o) => o.id)).toEqual(["reference"]);
    expect(options).toEqual(before);
    expect(groups.available[2].verification).toBe("seller-claimed");
  });
  it("ignores affiliate revenue, keeps ties stable and prefers genuine within equal verification", () => {
    const options = [
      option("compatible", "seller-claimed", "compatible", true, true),
      option("first", "seller-claimed", "genuine", true, false),
      option("second", "seller-claimed", "genuine", true, true),
      option("unverified", "unverified", "genuine", true),
    ];
    expect(groupPurchaseOptions(options).available.map((o) => o.id)).toEqual([
      "first",
      "second",
      "compatible",
      "unverified",
    ]);
  });
});

describe("sales package presentation", () => {
  it("separates mixed bundles from individual parts and deduplicates a shared bundle", () => {
    const parts = consumables.filter((part) => part.id.startsWith("eufy-s1-pro-"));
    const before = structuredClone(parts);
    const bundles = getPurchaseBundles(parts, parts[0].compatibleModelIds[0]);
    expect(bundles).toHaveLength(1);
    expect(bundles[0].parts).toHaveLength(5);
    expect(bundles[0].option.purchaseLinks).toHaveLength(1);
    for (const part of parts) {
      const groups = groupPurchaseOptions(part.productOptions);
      expect(groups.available.length).toBeGreaterThan(0);
      expect(
        groups.available
          .flatMap((option) => option.purchaseLinks)
          .every((link) => link.purchaseScope === "individual"),
      ).toBe(true);
      expect(groups.reference.every((option) => !option.purchaseLinks.length)).toBe(true);
    }
    expect(parts).toEqual(before);
  });
  it("keeps same-part multipacks and integrated filters in the individual list", () => {
    for (const id of [
      "narwal-freo-side-brush",
      "blueair-3410-particle-carbon-filter",
      "dyson-360-glass-hepa-carbon-filter",
    ]) {
      const part = consumables.find((part) => part.id === id)!;
      expect(getPurchaseBundles([part], part.compatibleModelIds[0])).toHaveLength(0);
      expect(groupPurchaseOptions(part.productOptions).available.length).toBeGreaterThan(0);
    }
  });
  it("does not present the number needed for replacement as a seller pack", () => {
    expect(
      getSalesPackageLabel(
        "PFSALC01 · AS355NSNA 1회 교체 시 2개 필요",
        { itemCode: "PFSALC01", requiredQuantity: "1회 교체 시 2개 필요" },
        "AS355NSNA",
      ),
    ).toBe("판매 구성 확인 필요");
    expect(getSalesPackageLabel(undefined, undefined, "AS355NSNA")).toBe("판매 구성 확인 필요");
  });
  it("preserves actual package information and unresolved labels", () => {
    expect(
      getSalesPackageLabel("필터 2개입 · 1개 필요", { requiredQuantity: "1개 필요" }, "MODEL"),
    ).toBe("필터 2개입 · 1개 필요");
    expect(getSalesPackageLabel("Replacement Side Brush, 2개", undefined, "MODEL")).toBe(
      "Replacement Side Brush, 2개",
    );
  });
});
