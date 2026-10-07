import { readFile } from "node:fs/promises";
import { loadRawCatalog } from "./lib/catalog-schema";
import { sqlTables } from "./lib/catalog-sql";
const raw = await loadRawCatalog();
const [schema, queries, mutations, seed] = await Promise.all(
  [
    "dataconnect/schema/schema.gql",
    "dataconnect/catalog/queries.gql",
    "dataconnect/catalog/mutations.gql",
    "dataconnect/seed_data.gql",
  ].map((f) => readFile(f, "utf8")),
);
for (const [file, table] of sqlTables) {
  const type = table[0].toUpperCase() + table.slice(1);
  if (!schema.includes("type " + type)) throw new Error("Missing table " + type);
  if (raw[file].length && !seed.includes(table + "_upsertMany"))
    throw new Error("Missing seed " + table);
  for (const row of raw[file])
    if (row.id && !seed.includes("id: " + JSON.stringify(row.id)))
      throw new Error("Missing ID " + row.id);
}
for (const operation of queries.split("query ").slice(1))
  if (!operation.includes("@auth(level: PUBLIC")) throw new Error("Public auth missing");
for (const operation of mutations.split("mutation ").slice(1))
  if (!operation.includes("auth.token.admin == true")) throw new Error("Admin auth missing");
if (seed.includes("@auth") || seed.includes("_insertMany"))
  throw new Error("Seed must be local idempotent upserts");
console.log(
  "v2 SQL static checks passed: " +
    sqlTables.length +
    " tables. Run database:compile for schema validation.",
);
