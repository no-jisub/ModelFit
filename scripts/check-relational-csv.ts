import { loadRawCatalog } from "./lib/catalog-schema";
const raw = await loadRawCatalog();
console.log(
  "v2 raw catalog validation passed: " +
    Object.entries(raw)
      .map(([file, rows]) => file + " " + rows.length)
      .join(", "),
);
