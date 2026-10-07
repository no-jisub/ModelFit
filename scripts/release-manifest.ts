import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { catalogCiFiles, verifyCatalogFingerprint } from "./lib/catalog-ci";

const version = JSON.parse(await readFile("data/catalog-version.json", "utf8"));
const sources = Object.fromEntries(
  await Promise.all(catalogCiFiles.map(async (file) => [file, await readFile(file, "utf8")])),
);
verifyCatalogFingerprint(sources, version.sha256);
async function fileHashes(directory: string): Promise<Array<[string, string]>> {
  const files: Array<[string, string]> = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await fileHashes(name)));
    else if (entry.isFile())
      files.push([
        path.relative("dist", name).replaceAll("\\", "/"),
        createHash("sha256")
          .update(await readFile(name))
          .digest("hex"),
      ]);
  }
  return files.sort(([a], [b]) => a.localeCompare(b, "en"));
}
const files = await fileHashes("dist");
if (!files.length) throw new Error("빌드 결과가 없습니다.");
const gitArgs = ["-c", `safe.directory=${process.cwd().replaceAll("\\", "/")}`];
const commit = execFileSync("git", [...gitArgs, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const dirty = Boolean(
  execFileSync("git", [...gitArgs, "status", "--porcelain"], { encoding: "utf8" }).trim(),
);
const report = {
  generatedAt: new Date().toISOString(),
  commit,
  dirty,
  catalogSha256: version.sha256,
  lockfileSha256: createHash("sha256")
    .update(await readFile("package-lock.json"))
    .digest("hex"),
  buildSha256: createHash("sha256").update(JSON.stringify(files)).digest("hex"),
  fileCount: files.length,
  files: Object.fromEntries(files),
};
await mkdir("outputs", { recursive: true });
await writeFile("outputs/release-manifest.json", JSON.stringify(report, null, 2) + "\n");
console.log(
  `배포 manifest 생성: ${files.length}개 파일, 카탈로그 ${version.sha256}, 미커밋 변경 ${dirty}`,
);
