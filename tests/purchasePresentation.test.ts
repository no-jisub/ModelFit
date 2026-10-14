import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import {
  groupPurchaseOptions,
  getSalesPackageLabel,
  getPurchaseBundles,
  getModelPurchaseOptions,
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
  it("limits individual and bundle seller offers to their explicitly reviewed models", () => {
    const shared = option("shared", "official-genuine", "genuine", true);
    const scoped = {
      ...option("scoped", "seller-claimed", "compatible", true),
      applicableModelIds: ["coway-ap-1521b"],
    };
    const original = structuredClone([shared, scoped]);
    expect(getModelPurchaseOptions([shared, scoped], "coway-ap-2021a").map((o) => o.id)).toEqual([
      "shared",
    ]);
    expect(getModelPurchaseOptions([shared, scoped], "coway-ap-1521b").map((o) => o.id)).toEqual([
      "shared",
      "scoped",
    ]);
    scoped.purchaseLinks = scoped.purchaseLinks.map((link) => ({
      ...link,
      purchaseScope: "bundle",
    }));
    const part = { ...consumables[0], productOptions: [scoped] };
    expect(getPurchaseBundles([part], "coway-ap-2021a")).toEqual([]);
    expect(getPurchaseBundles([part], "coway-ap-1521b")).toHaveLength(1);
    expect(shared).toEqual(original[0]);
  });
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
    const parts = structuredClone(consumables.filter((part) => part.id.startsWith("eufy-s1-pro-")));
    const sample = consumables.flatMap((p) => p.productOptions).flatMap((o) => o.purchaseLinks)[0];
    for (const part of parts) {
      const bundle = part.productOptions.find((o) => o.kind === "compatible")!;
      bundle.purchaseLinks = [
        {
          ...sample,
          id: part.id + "-fixture",
          url: "https://link.coupang.com/a/testbundle",
          purchaseScope: "bundle",
        },
      ];
      const individual = part.productOptions.find((o) => o.kind === "genuine")!;
      individual.purchaseLinks = [
        { ...sample, id: part.id + "-individual-fixture", purchaseScope: "individual" },
      ];
    }
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
    ).toBe("수량은 구매처에서 확인");
    expect(getSalesPackageLabel(undefined, undefined, "AS355NSNA")).toBe("수량은 구매처에서 확인");
  });
  it("preserves actual package information and unresolved labels", () => {
    expect(getSalesPackageLabel("필터 2개입 옵션 선택 필요", undefined, "MODEL")).toBe(
      "필터 2개입 옵션 선택 필요",
    );
    expect(
      getSalesPackageLabel("필터 2개입 · 1개 필요", { requiredQuantity: "1개 필요" }, "MODEL"),
    ).toBe("필터 2개입");
    expect(getSalesPackageLabel("Replacement Side Brush, 2개", undefined, "MODEL")).toBe(
      "Replacement Side Brush, 2개",
    );
  });
});
