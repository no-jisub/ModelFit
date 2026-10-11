import { describe, expect, it } from "vitest";
import { models } from "../src/data/models";
import { consumables } from "../src/data/consumables";
import { groupModelConsumables } from "../src/utils/groupModelConsumables";

describe("LG main filter grouping", () => {
  it("groups replacement choices into three types without changing raw relationships", () => {
    const before = JSON.stringify(consumables);
    for (const model of models.filter((m) => m.brandId === "lg" && m.category === "air-purifier")) {
      const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
      const grouped = groupModelConsumables(parts);
      expect(grouped).toHaveLength(3);
      expect(grouped.map((part) => part.type)).toEqual([
        "all-in-one-filter",
        "pre-filter",
        "moving-wheel",
      ]);
      const main = grouped[0];
      expect(main.displayName).toBe("메인 필터");
      expect(main.genuinePartNumber).toBeUndefined();
      expect(main.productOptions.map((option) => option.id)).toEqual(
        main.groupedParts!.flatMap((part) => part.productOptions.map((option) => option.id)),
      );
      const sellers = main.productOptions.filter((option) => option.kind === "compatible");
      expect(sellers).toHaveLength(model.modelCode === "AS205NGJA" ? 2 : 0);
      for (const option of sellers) expect(option.verification).toBe("seller-claimed");
    }
    expect(JSON.stringify(consumables)).toBe(before);
  });

  it("leaves unrelated brands unchanged", () => {
    const model = models.find((m) => m.brandId === "winix")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(groupModelConsumables(parts)).toBe(parts);
  });
});
