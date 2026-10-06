import { describe, expect, it } from "vitest";
import {
  catalogCiFiles,
  packCatalogCi,
  unpackCatalogCi,
  catalogFingerprint,
  verifyCatalogFingerprint,
} from "../scripts/lib/catalog-ci";
const files = Object.fromEntries(
  catalogCiFiles.map((name) => [name, "\uFEFFid,name\r\n1,한글 CSV\r\n"]),
);
describe("CI catalog transfer", () => {
  it("rejects a stale or mixed snapshot before writing any CSV", () => {
    const expected = catalogFingerprint(files);
    expect(() => verifyCatalogFingerprint(files, expected)).not.toThrow();
    const changed = { ...files, [catalogCiFiles[0]]: files[catalogCiFiles[0]] + "2,new\r\n" };
    expect(() => verifyCatalogFingerprint(changed, expected)).toThrow(/버전 불일치/);
    expect(() => verifyCatalogFingerprint(files, undefined)).toThrow(/SHA-256/);
    expect(catalogFingerprint(Object.fromEntries(Object.entries(files).reverse()))).toBe(expected);
  });
  it("preserves CSV bytes including Korean, BOM and line endings", () => {
    const [first, second] = packCatalogCi(files);
    expect(unpackCatalogCi(first, second)).toEqual(files);
  });
  it("fails without both secrets instead of building an empty catalog", () => {
    const [first] = packCatalogCi(files);
    expect(() => unpackCatalogCi(first, undefined)).toThrow(/Secrets/);
  });
  it("rejects extra paths, executable generated files and missing sources", () => {
    expect(() => packCatalogCi({ ...files, "../outside.csv": "data" })).toThrow();
    expect(() =>
      packCatalogCi({ ...files, "src/data/importedCatalogModels.ts": "code" }),
    ).toThrow();
    const incomplete = { ...files };
    delete incomplete[catalogCiFiles[0]];
    expect(() => packCatalogCi(incomplete)).toThrow();
  });
  it("rejects damaged payloads", () => {
    const [first, second] = packCatalogCi(files);
    expect(() => unpackCatalogCi(first, second.slice(0, -8))).toThrow();
  });
});
