import { describe, expect, it } from "vitest";
import { catalogCiFiles, packCatalogCi, unpackCatalogCi } from "../scripts/lib/catalog-ci";
const files = Object.fromEntries(
  catalogCiFiles.map((name) => [name, "\uFEFFid,name\r\n1,한글 CSV\r\n"]),
);
describe("CI catalog transfer", () => {
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
