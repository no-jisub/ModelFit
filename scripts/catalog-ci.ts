import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { catalogCiFiles, packCatalogCi, unpackCatalogCi } from "./lib/catalog-ci";

import { loadRawCatalog, parseRawCatalogFiles } from "./lib/catalog-schema";
const command = process.argv[2];
if (command === "pack") {
  await loadRawCatalog();
  const files = Object.fromEntries(
    await Promise.all(catalogCiFiles.map(async (name) => [name, await readFile(name, "utf8")])),
  );
  const parts = packCatalogCi(files);
  await mkdir("outputs", { recursive: true });
  for (const [index, part] of parts.entries())
    await writeFile("outputs/catalog-ci-" + (index + 1) + ".txt", part, { mode: 0o600 });
  console.log(
    "CI 카탈로그 패키지 생성 완료: outputs/catalog-ci-{1,2}.txt (Git 제외, 각 " +
      parts.map((p) => Buffer.byteLength(p)).join(" / ") +
      " bytes)",
  );
} else if (command === "restore") {
  const files = unpackCatalogCi(
    process.env.MODELFIT_CATALOG_GZIP_1,
    process.env.MODELFIT_CATALOG_GZIP_2,
  );
  parseRawCatalogFiles(
    Object.fromEntries(
      Object.entries(files).map(([name, content]) => [path.basename(name), content]),
    ),
  );
  for (const [name, content] of Object.entries(files)) {
    await mkdir(path.dirname(name), { recursive: true });
    await writeFile(name, content, "utf8");
  }
  console.log("CI 카탈로그 원본 복원 완료: " + Object.keys(files).length + "개 CSV");
} else throw new Error("사용법: catalog-ci.ts pack | restore");
