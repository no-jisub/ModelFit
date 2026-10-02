import { describe, expect, it } from "vitest";
import { loadRawCatalog, validateRawCatalog, encodeCsv } from "../scripts/lib/catalog-schema";
import { parseCsvRows } from "../scripts/lib/catalog-csv";
describe("raw v2 catalog validation", () => {
  it("validates raw data without importing generated data", async () =>
    expect(validateRawCatalog(await loadRawCatalog())).toEqual([]));
  it("rejects broken references, duplicate relationships and false scoped evidence", async () => {
    const raw = await loadRawCatalog();
    const row = raw["model-consumables.csv"][0];
    row.modelId = "missing";
    row.evidenceScope = "scoped";
    raw["model-consumables.csv"].push({ ...row, id: "new" });
    const errors = validateRawCatalog(raw).join("\n");
    expect(errors).toContain("invalid reference modelId");
    expect(errors).toContain("scoped evidence missing");
    expect(errors).toContain("duplicate modelId/consumableId");
  });
  it("requires release evidence and preserves explicit IDs", async () => {
    const raw = await loadRawCatalog();
    const model = raw["models.csv"].find((m) => m.releaseDate)!;
    raw["model-sources.csv"] = raw["model-sources.csv"].filter(
      (r) => r.modelId !== model.id || r.purpose !== "release-date",
    );
    expect(validateRawCatalog(raw).join("\n")).toContain("missing release evidence");
  });
  it("round trips quoted Korean CSV fields", () =>
    expect(parseCsvRows(encodeCsv("id,label", [{ id: "a", label: '가,나 "다"\n라' }]))).toEqual([
      ["id", "label"],
      ["a", '가,나 "다"\n라'],
    ]));
});
