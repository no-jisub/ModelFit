import { expect, it } from "vitest";
import { catalogSchema, type RawCatalog } from "../scripts/lib/catalog-schema";
import { prioritizeBacklog } from "../scripts/lib/backlog-priority";

it("실제 입력 이벤트가 없을 때 구매 연결 미검증을 우선하고 이용량을 만들지 않는다", () => {
  const raw = Object.fromEntries(
    Object.keys(catalogSchema).map((key) => [key, []]),
  ) as unknown as RawCatalog;
  raw["models.csv"] = [
    { id: "verified", modelCode: "A", brandId: "b", status: "published" },
    { id: "unverified", modelCode: "B", brandId: "b", status: "published" },
  ];
  raw["model-consumables.csv"] = [
    {
      id: "a",
      modelId: "verified",
      consumableId: "p1",
      verificationStatus: "official",
      evidenceScope: "scoped",
    },
    {
      id: "b",
      modelId: "unverified",
      consumableId: "p2",
      verificationStatus: "unverified",
      evidenceScope: "legacy-unscoped",
    },
  ];
  raw["product-options.csv"] = [{ id: "o", consumableId: "p2", isActive: "true" }];
  raw["purchase-links.csv"] = [{ productOptionId: "o", isActive: "true" }];
  const baseline = prioritizeBacklog(raw);
  expect(baseline.map((r) => r.modelId)).toEqual(["unverified", "verified"]);
  expect(baseline.every((r) => r.pageViews === null && r.purchaseClicks === null)).toBe(true);
  const demand = prioritizeBacklog(raw, [{ modelId: "verified", pageViews: 2, purchaseClicks: 1 }]);
  expect(demand[0].modelId).toBe("verified");
  raw["purchase-links.csv"][0].isActive = "false";
  expect(prioritizeBacklog(raw)[0].modelId).toBe("verified");
});
