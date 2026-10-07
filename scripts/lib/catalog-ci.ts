import { gzipSync, gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { catalogSchema } from "./catalog-schema";

export const catalogCiFiles = Object.keys(catalogSchema).map((file) => "data/catalog/" + file);
const maxSecretBytes = 45_000;

export function catalogFingerprint(files: Record<string, string>): string {
  validateFiles(files);
  return createHash("sha256")
    .update(JSON.stringify(catalogCiFiles.toSorted().map((name) => [name, files[name]])))
    .digest("hex");
}

export function verifyCatalogFingerprint(files: Record<string, string>, expected: unknown) {
  if (typeof expected !== "string" || !/^[a-f0-9]{64}$/.test(expected))
    throw new Error(
      "유효한 data/catalog-version.json SHA-256이 필요합니다. catalog:ci:pack을 실행하세요.",
    );
  if (catalogFingerprint(files) !== expected)
    throw new Error(
      "카탈로그 버전 불일치: 현재 소스와 CI Secrets의 CSV 스냅샷이 다릅니다. 동일 패키지의 Secrets를 함께 갱신하세요.",
    );
}

export function packCatalogCi(files: Record<string, string>): [string, string, string?] {
  validateFiles(files);
  const encoded = gzipSync(Buffer.from(JSON.stringify({ version: 2, files })), {
    level: 9,
  }).toString("base64");
  if (encoded.length > maxSecretBytes * 3)
    throw new Error(
      "CI 카탈로그가 Secret 3개 용량을 초과합니다. 비공개 데이터 저장소로 전환하세요.",
    );
  const count = encoded.length > maxSecretBytes * 2 ? 3 : 2;
  const size = Math.ceil(encoded.length / count);
  return count === 2
    ? [encoded.slice(0, size), encoded.slice(size)]
    : [encoded.slice(0, size), encoded.slice(size, size * 2), encoded.slice(size * 2)];
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
  third?: string,
): Record<string, string> {
  if (!first?.trim() || !second?.trim())
    throw new Error(
      "MODELFIT_CATALOG_GZIP_1 및 MODELFIT_CATALOG_GZIP_2 GitHub Secrets가 필요합니다.",
    );
  const parts = [first.trim(), second.trim(), third?.trim() ?? ""];
  const encoded = parts.join("");
  if (parts.some((part) => part.length > maxSecretBytes) || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))
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
