import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { loadRawCatalog } from "./lib/catalog-schema";
import { buildCatalogView } from "./lib/catalog-view";
const view = buildCatalogView(await loadRawCatalog());
const outputs = {
  "src/data/importedCatalogMetadata.ts":
    'import type { Brand } from "@/types";\n/** Generated from validated v2 CSV. */\nexport const relationalCategories = ' +
    JSON.stringify(view.categories) +
    " as const;\nexport const relationalBrands: Brand[] = " +
    JSON.stringify(view.brands) +
    ";\n",
  "src/data/importedCatalogModels.ts":
    'import type { ApplianceModel } from "@/types";\n/** Generated from validated v2 CSV. */\nexport const importedCatalogModels: ApplianceModel[] = ' +
    JSON.stringify(view.models) +
    ";\n",
  "src/data/importedRelationalCatalog.ts":
    'import type { ConsumableCompatibility,ModelImage,ModelConsumable } from "@/types";\nexport {relationalCategories,relationalBrands} from "./importedCatalogMetadata";\nexport const relationalConsumables: ConsumableCompatibility[] = ' +
    JSON.stringify(view.consumables) +
    ";\nexport const relationalModelImages: Record<string,ModelImage> = " +
    JSON.stringify(view.modelImages) +
    ";\nexport const relationalModelConsumableIds: Record<string,string[]> = " +
    JSON.stringify(view.modelConsumableIds) +
    ";\nexport const relationalCompatibilities: ModelConsumable[] = " +
    JSON.stringify(view.relations) +
    ";\n",
};
for (const [file, text] of Object.entries(outputs)) {
  const formatted = await prettier.format(text, { parser: "typescript", printWidth: 100 });
  if (process.argv.includes("--check")) {
    if ((await readFile(path.resolve(file), "utf8").catch(() => "")) !== formatted)
      throw new Error(file + ": stale generated data; run catalog:import");
  } else await writeFile(path.resolve(file), formatted);
}
console.log(
  "Validated v2 catalog: " +
    view.models.length +
    " models, " +
    view.relations.length +
    " compatibility records.",
);
