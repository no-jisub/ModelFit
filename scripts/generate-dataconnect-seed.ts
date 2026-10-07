import { writeFile } from "node:fs/promises";
import prettier from "prettier";
import { loadRawCatalog } from "./lib/catalog-schema";
import { createCatalogSeed } from "./lib/catalog-sql";
await writeFile(
  "dataconnect/seed_data.gql",
  await prettier.format(createCatalogSeed(await loadRawCatalog()), { parser: "graphql" }),
);
console.log("v2 SQL seed generated from validated raw catalog.");
