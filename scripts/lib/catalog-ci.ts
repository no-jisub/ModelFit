import { gzipSync, gunzipSync } from "node:zlib";
import { catalogSchema } from "./catalog-schema";

export const catalogCiFiles = Object.keys(catalogSchema).map((file) => "data/catalog/" + file);
const maxSecretBytes = 45_000;

export function packCatalogCi(files: Record<string, string>): [string, string] {
  validateFiles(files);
  const encoded = gzipSync(Buffer.from(JSON.stringify({ version: 2, files })), {
    level: 9,
  }).toString("base64");
  if (encoded.length > maxSecretBytes * 2)
    throw new Error(
      "CI 카탈로그가 Secret 2개 용량을 초과합니다. 비공개 데이터 저장소로 전환하세요.",
    );
  const midpoint = Math.ceil(encoded.length / 2);
  return [encoded.slice(0, midpoint), encoded.slice(midpoint)];
}

function validateFiles(files: unknown): asserts files is Record<string, string> {
  if (!files || typeof files !== "object" || Array.isArray(files))
    throw new Error("잘못된 CI 카탈로그 파일 목록입니다.");
  const entries = Object.entries(files);
  if (
    entries.length !== catalogCiFiles.length ||
    entries.some(
      ([name, content]) =>
        !(catalogCiFiles as readonly string[]).includes(name) ||
        typeof content !== "string" ||
        !content.trim(),
    )
  ) {
    throw new Error("CI 카탈로그는 지정된 v2 원본 CSV 18개만 포함해야 합니다.");
  }
}

export function unpackCatalogCi(
  first: string | undefined,
  second: string | undefined,
): Record<string, string> {
  if (!first?.trim() || !second?.trim())
    throw new Error(
      "MODELFIT_CATALOG_GZIP_1 및 MODELFIT_CATALOG_GZIP_2 GitHub Secrets가 필요합니다.",
    );
  const encoded = first.trim() + second.trim();
  if (encoded.length > maxSecretBytes * 2 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))
    throw new Error("CI 카탈로그 인코딩이 올바르지 않습니다.");
  const archive = JSON.parse(
    gunzipSync(Buffer.from(encoded, "base64"), { maxOutputLength: 8 * 1024 * 1024 }).toString(
      "utf8",
    ),
  );
  if (archive.version !== 2) throw new Error("지원하지 않는 CI 카탈로그 버전입니다.");
  validateFiles(archive.files);
  return archive.files;
}
