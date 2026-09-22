import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

interface ManifestFile {
  path: string;
  bytes: number;
  sha256: string;
}

interface BackupManifest {
  formatVersion: 1;
  createdAt: string;
  files: ManifestFile[];
}

const root = process.cwd();
const backupRoot = path.resolve(
  process.env.MODELFIT_PRIVATE_BACKUP_DIR ?? path.join(root, "private-backups"),
);
const fixedPrivateFiles = [
  "src/data/importedCatalogModels.ts",
  "src/data/importedRelationalCatalog.ts",
  "dataconnect/seed_data.gql",
];

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listMatchingFiles(directory: string, extension: string, excluded: string[] = []) {
  const absoluteDirectory = path.join(root, directory);
  if (!(await exists(absoluteDirectory))) return [];

  return (await readdir(absoluteDirectory, { withFileTypes: true }))
    .filter(
      (entry) => entry.isFile() && entry.name.endsWith(extension) && !excluded.includes(entry.name),
    )
    .map((entry) => path.posix.join(directory.replaceAll("\\", "/"), entry.name));
}

async function privateFiles() {
  const candidates = [
    ...(await listMatchingFiles("data/catalog", ".csv")),
    ...(await listMatchingFiles("data/import", ".csv")),
    ...(await listMatchingFiles("src/data/consumables", ".ts", ["index.ts", "shared.ts"])),
    ...fixedPrivateFiles,
  ];

  const present: string[] = [];
  for (const relativePath of candidates) {
    if (await exists(path.join(root, relativePath))) present.push(relativePath);
  }
  return [...new Set(present)].sort();
}

function hash(content: Buffer) {
  return createHash("sha256").update(content).digest("hex");
}

function timestamp() {
  return new Date().toISOString().replaceAll(":", "-").replace(".", "-");
}

async function resolveSnapshot(value: string) {
  await mkdir(backupRoot, { recursive: true });
  const snapshotName =
    value === "latest"
      ? (await readFile(path.join(backupRoot, "latest.txt"), "utf8")).trim()
      : value;
  const snapshotDirectory = path.resolve(backupRoot, snapshotName);
  if (path.dirname(snapshotDirectory) !== path.resolve(backupRoot)) {
    throw new Error("백업 이름은 private-backups 바로 아래의 폴더여야 합니다.");
  }
  return { snapshotName, snapshotDirectory };
}

async function loadManifest(snapshotDirectory: string) {
  const raw = await readFile(path.join(snapshotDirectory, "manifest.json"), "utf8");
  return JSON.parse(raw) as BackupManifest;
}

async function verify(snapshotDirectory: string, manifest: BackupManifest) {
  const errors: string[] = [];
  for (const file of manifest.files) {
    const content = await readFile(path.join(snapshotDirectory, file.path));
    if (content.byteLength !== file.bytes || hash(content) !== file.sha256) {
      errors.push(file.path);
    }
  }
  if (errors.length > 0) {
    throw new Error(`백업 무결성 검사 실패: ${errors.join(", ")}`);
  }
}

async function backup() {
  const files = await privateFiles();
  if (files.length === 0) throw new Error("백업할 비공개 데이터 파일이 없습니다.");

  const snapshotName = timestamp();
  const snapshotDirectory = path.join(backupRoot, snapshotName);
  const manifest: BackupManifest = {
    formatVersion: 1,
    createdAt: new Date().toISOString(),
    files: [],
  };

  for (const relativePath of files) {
    const source = path.join(root, relativePath);
    const destination = path.join(snapshotDirectory, relativePath);
    const content = await readFile(source);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
    manifest.files.push({
      path: relativePath,
      bytes: content.byteLength,
      sha256: hash(content),
    });
  }

  await writeFile(
    path.join(snapshotDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await writeFile(path.join(backupRoot, "latest.txt"), `${snapshotName}\n`, "utf8");
  await verify(snapshotDirectory, manifest);
  console.log(`비공개 데이터 백업 완료: ${snapshotName} (${files.length}개 파일)`);
}

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function verifyCommand() {
  const from = argument("--from") ?? "latest";
  const { snapshotName, snapshotDirectory } = await resolveSnapshot(from);
  const manifest = await loadManifest(snapshotDirectory);
  await verify(snapshotDirectory, manifest);
  console.log(`백업 무결성 검사 통과: ${snapshotName} (${manifest.files.length}개 파일)`);
}

async function restore() {
  if (!process.argv.includes("--force")) {
    throw new Error("복구는 기존 로컬 데이터를 덮어씁니다. --force 옵션을 추가하세요.");
  }
  const from = argument("--from") ?? "latest";
  const { snapshotName, snapshotDirectory } = await resolveSnapshot(from);
  const manifest = await loadManifest(snapshotDirectory);
  await verify(snapshotDirectory, manifest);

  for (const file of manifest.files) {
    const source = path.join(snapshotDirectory, file.path);
    const destination = path.join(root, file.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
  console.log(`비공개 데이터 복구 완료: ${snapshotName} (${manifest.files.length}개 파일)`);
}

const command = process.argv[2];
if (command === "backup") await backup();
else if (command === "verify") await verifyCommand();
else if (command === "restore") await restore();
else throw new Error("사용법: backup | verify --from latest | restore --from latest --force");
