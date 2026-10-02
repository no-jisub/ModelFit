import { readFile, writeFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { loadRawCatalog } from "./lib/catalog-schema";
import { buildCatalogView } from "./lib/catalog-view";
import { parseCsvRows } from "./lib/catalog-csv";
const args = process.argv.slice(2);
const backup = args[args.indexOf("--from") + 1];
if (!args.includes("--from") || !backup) throw new Error("Use --from v1 backup directory");
const baseline = JSON.parse(await readFile("outputs/normalization/v1-baseline.json", "utf8"));
const raw = await loadRawCatalog();
const view = buildCatalogView(raw);
const assert = (ok: boolean, message: string) => {
  if (!ok) throw new Error(message);
};
const readOld = async (file: string) => {
  const rows = parseCsvRows(await readFile(backup + "/data/catalog/" + file, "utf8"));
  const headers = rows.shift()!;
  return rows.map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i]])));
};
const same = (left: unknown, right: unknown, label: string) =>
  assert(
    isDeepStrictEqual(
      JSON.parse(JSON.stringify(left ?? null)),
      JSON.parse(JSON.stringify(right ?? null)),
    ),
    label,
  );
for (const file of ["categories.csv", "images.csv", "sources.csv"])
  same(raw[file as keyof typeof raw], await readOld(file), "Raw provenance changed: " + file);
const oldOptions = await readOld("product-options.csv");
same(
  raw["product-options.csv"]
    .map((o) => ({ ...o, partNumber: o.itemCode, itemCode: undefined }))
    .map((o) => {
      delete o.itemCode;
      return o;
    }),
  oldOptions,
  "Option identity or content changed",
);
const oldLinks = await readOld("purchase-links.csv");
const newLinks = [...raw["purchase-links.csv"], ...raw["guidance-links.csv"]];
same(newLinks.map((l) => l.id).sort(), oldLinks.map((l) => l.id).sort(), "Link IDs changed");
for (const old of oldLinks) {
  const current = newLinks.find((l) => l.id === old.id)!;
  for (const field of ["productOptionId", "url", "label", "channel", "checkedAt", "isActive"])
    assert(current[field] === old[field], "Link field changed " + old.id + "/" + field);
}
for (const old of baseline.models) {
  const model = view.models.find((m) => m.id === old.id)!;
  assert(Boolean(model), "Model missing " + old.id);
  for (const key of [
    "id",
    "slug",
    "category",
    "brandId",
    "modelName",
    "modelCode",
    "aliases",
    "releaseDate",
    "consumableIds",
    "image",
    "lastVerifiedAt",
    "verificationStatus",
  ])
    same(model[key as keyof typeof model], old[key], "Model changed " + old.id + "/" + key);
  same(
    model.sources.map(({ id, ...source }) => source),
    old.sources,
    "Model source changed " + old.id,
  );
}
same(
  view.models.map((m) => m.id),
  baseline.models.map((m: { id: string }) => m.id),
  "Model sequence changed",
);
for (const old of baseline.configurations) {
  const part = view.consumables.find((p) => p.id === old.consumableId)!;
  same(
    part.compatibilities.find((r) => r.modelId === old.modelId)?.configuration,
    old.configuration,
    "Presentation changed " + old.modelId + "/" + old.consumableId,
  );
}
for (const old of baseline.maintenance)
  same(
    view.consumables.find((p) => p.id === old.id)?.maintenance,
    old.value,
    "Maintenance changed " + old.id,
  );
for (const old of baseline.consumables) {
  const part = view.consumables.find((p) => p.id === old.id)!;
  for (const key of [
    "slug",
    "type",
    "displayName",
    "genuinePartNumber",
    "partNumberStatus",
    "compatibleModelIds",
    "searchKeywords",
    "purchaseWarning",
    "verificationStatus",
  ])
    same(part[key as keyof typeof part], old[key], "Part changed " + old.id + "/" + key);
}
const report = {
  passed: true,
  models: view.models.length,
  parts: view.consumables.length,
  relations: view.relations.length,
  options: oldOptions.length,
  preservedLinks: oldLinks.length,
  modelUrls: view.models.map(
    (m) => "/model/" + view.brands.find((b) => b.id === m.brandId)!.slug + "/" + m.slug + "/",
  ),
};
await writeFile("outputs/normalization/preservation-v2.json", JSON.stringify(report, null, 2));
console.log(
  "Migration preservation checks passed: " +
    JSON.stringify({ ...report, modelUrls: report.modelUrls.length }),
);
