import { describe, expect, it } from "vitest";
import { loadRawCatalog, validateRawCatalog } from "../scripts/lib/catalog-schema";
import { buildCatalogView } from "../scripts/lib/catalog-view";
import { legacyConfiguration, legacyMaintenance } from "../scripts/lib/catalog-v1";
describe("catalog normalization behavior", () => {
  it("preserves model identity when labels and model codes are edited", async () => {
    const raw = await loadRawCatalog();
    const model = raw["models.csv"][0];
    const original = { id: model.id, slug: model.slug };
    model.modelCode = "NEW-CODE";
    model.modelName = "새 표시 이름";
    const view = buildCatalogView(raw).models[0];
    expect({ id: view.id, slug: view.slug }).toEqual(original);
  });
  it("does not promote part verification to relation verification", async () => {
    const raw = await loadRawCatalog();
    const relation = raw["model-consumables.csv"][0];
    relation.verificationStatus = "unverified";
    const part = buildCatalogView(raw).consumables.find((p) => p.id === relation.consumableId)!;
    expect(part.verificationStatus).toBe("official");
    expect(part.compatibilities.find((r) => r.id === relation.id)?.verificationStatus).toBe(
      "unverified",
    );
  });
  it("keeps source identity stable while its check date changes", async () => {
    const raw = await loadRawCatalog();
    const source = raw["sources.csv"].find((s) =>
      raw["model-sources.csv"].some((j) => j.sourceId === s.id),
    )!;
    source.checkedAt = "2026-10-02";
    expect(
      buildCatalogView(raw)
        .models.flatMap((m) => m.sources)
        .find((s) => s.id === source.id)?.checkedAt,
    ).toBe("2026-10-02");
  });
  it("excludes unpublished models and inactive purchases from generated views", async () => {
    const raw = await loadRawCatalog();
    raw["models.csv"][0].status = "draft";
    const link = raw["purchase-links.csv"][0];
    link.isActive = "false";
    const view = buildCatalogView(raw);
    expect(view.models.some((m) => m.id === raw["models.csv"][0].id)).toBe(false);
    expect(
      view.consumables
        .flatMap((p) => p.productOptions.flatMap((o) => o.purchaseLinks))
        .some((l) => l.id === link.id),
    ).toBe(false);
  });
  it("rejects invalid calendar dates without crashing", async () => {
    const raw = await loadRawCatalog();
    raw["sources.csv"][0].checkedAt = "2026-02-30";
    raw["models.csv"][0].releaseDate = "2026-02-30";
    expect(validateRawCatalog(raw).join("\n")).toContain("invalid date checkedAt");
    expect(validateRawCatalog(raw).join("\n")).toContain("invalid release calendar date");
  });
  it("rejects inactive public metadata, primary-image collisions and cross-table link IDs", async () => {
    const raw = await loadRawCatalog();
    raw["brands.csv"][0].isActive = "false";
    raw["images.csv"].push({ ...raw["images.csv"][0], id: "other" });
    raw["guidance-links.csv"][0].id = raw["purchase-links.csv"][0].id;
    const errors = validateRawCatalog(raw).join("\n");
    expect(errors).toContain("inactive metadata");
    expect(errors).toContain("multiple primary images");
    expect(errors).toContain("Link IDs overlap");
  });
  it("migrates historic display text without inferring absent quantities", () => {
    const options = [
      { isActive: "true", sortOrder: "1", packageLabel: "PFSACC01 · AS205NGJA 1개 필요" },
    ];
    expect(legacyConfiguration(options, "AS205NGJA")).toEqual({
      itemCode: "PFSACC01",
      requiredQuantity: "1개 필요",
    });
    expect(
      legacyConfiguration([{ ...options[0], packageLabel: "4D 프리필터 2개" }], "AP-1521B"),
    ).toEqual({ itemCode: undefined, composition: "4D 프리필터 2개" });
    expect(legacyMaintenance({ replacementInterval: "약 1년" })).toEqual({
      mode: "정기 교체",
      detail: "약 1년",
    });
    expect(legacyMaintenance({ purchaseWarning: "판매처에 문의하세요." })).toBeUndefined();
  });
});
