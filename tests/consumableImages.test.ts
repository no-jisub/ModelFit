import { describe, expect, it } from "vitest";
import { loadRawCatalog, validateRawCatalog } from "../scripts/lib/catalog-schema";
import { buildCatalogView } from "../scripts/lib/catalog-view";
import { stat } from "node:fs/promises";

describe("consumable image evidence", () => {
  it("has one existing local asset and active official source for every illustrated part", async () => {
    const raw = await loadRawCatalog();
    const parts = buildCatalogView(raw).consumables.filter((part) => part.image);
    expect(parts).toHaveLength(20);
    for (const part of parts) {
      expect((await stat("." + part.image!.src)).size).toBeGreaterThan(0);
      const row = raw["consumable-images.csv"].find((row) => row.consumableId === part.id)!;
      expect(part.image!.sourceUrl).toBe(
        raw["sources.csv"].find((source) => source.id === row.sourceId)!.url,
      );
    }
  });
  it("rejects duplicate parts, untrusted sources and unsafe asset paths", async () => {
    const raw = await loadRawCatalog();
    const row = raw["consumable-images.csv"][0];
    row.src = "/src/assets/consumables/../../private.png";
    row.sourceId = raw["sources.csv"].find((source) => source.sourceType === "seller")!.id;
    raw["consumable-images.csv"].push({ ...row, id: "duplicate-image" });
    const errors = validateRawCatalog(raw).join("\n");
    expect(errors).toContain("invalid local consumable image");
    expect(errors).toContain("missing active official image source");
    expect(errors).toContain("duplicate consumableId");
  });
});
