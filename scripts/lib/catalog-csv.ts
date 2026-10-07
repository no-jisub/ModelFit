import { readFile } from "node:fs/promises";
import path from "node:path";

export type CsvRow = Record<string, string>;

export function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const text = input.replace(/^\uFEFF/, "");

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }

  if (quoted) throw new Error("닫히지 않은 큰따옴표가 있습니다.");
  if (field || row.length) {
    row.push(field);
    if (row.some(Boolean)) rows.push(row);
  }
  return rows;
}

export async function readCatalogCsv(name: string): Promise<CsvRow[]> {
  const input = await readFile(path.resolve("data/catalog", name), "utf8");
  const rows = parseCsvRows(input);
  const headers = rows.shift() ?? [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

export const splitList = (value: string) =>
  value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

export const csvBoolean = (value: string) => value === "true";
export const csvInteger = (value: string) => Number.parseInt(value, 10);
export const optionalCsv = (value: string) => value || undefined;
