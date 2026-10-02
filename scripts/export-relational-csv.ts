import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { catalogSchema, loadRawCatalog, encodeCsv, type CatalogFile } from "./lib/catalog-schema";
const raw = await loadRawCatalog();
const output = path.resolve("outputs/catalog-export");
await mkdir(output, { recursive: true });
for (const file of Object.keys(catalogSchema) as CatalogFile[])
  await writeFile(path.join(output, file), encodeCsv(catalogSchema[file], raw[file]));
console.log("Validated canonical CSV export: " + output);
