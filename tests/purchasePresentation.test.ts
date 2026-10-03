import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { groupPurchaseOptions, getSalesPackageLabel } from "../src/utils/purchasePresentation";
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
