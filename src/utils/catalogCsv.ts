import type { ApplianceCategory, ImportedCatalogEntry, SourceReference } from "@/types";
import { toModelId } from "./modelSlug";

export const modelCsvHeaders = [
  "status",
  "category",
  "brandId",
  "modelName",
  "modelCode",
  "series",
  "sourceUrl",
  "sourceTitle",
  "sourceType",
  "verifiedAt",
  "releaseDate",
  "releaseSourceUrl",
  "aliases",
] as const;

export type ModelCsvHeader = (typeof modelCsvHeaders)[number];
export type ModelCsvStatus = "draft" | "published";

export interface ParsedCsvRecord {
  rowNumber: number;
  values: Record<ModelCsvHeader, string>;
}

export interface CatalogCsvValidationContext {
  categoryIds: ReadonlySet<string>;
  brandCategories: ReadonlyMap<string, ReadonlySet<string>>;
  existingModelIds: ReadonlySet<string>;
  existingModelCodes: ReadonlySet<string>;
}

export interface CatalogCsvValidationResult {
  entries: ImportedCatalogEntry[];
  errors: string[];
  draftCount: number;
  publishedCount: number;
}

const sourceTypes = new Set<SourceReference["sourceType"]>([
  "manufacturer",
  "official-manual",
  "official-store",
  "seller",
  "other",
]);

function parseCsvRows(input: string): string[][] {
  const text = input.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("닫히지 않은 큰따옴표가 있습니다.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function parseModelCsv(input: string): ParsedCsvRecord[] {
  const rows = parseCsvRows(input);
  const header = rows.shift()?.map((value) => value.trim()) ?? [];
  const missingHeaders = modelCsvHeaders.filter((name) => !header.includes(name));
  const unknownHeaders = header.filter(
    (name) => !modelCsvHeaders.includes(name as ModelCsvHeader) && name !== "",
  );

  if (missingHeaders.length > 0) {
    throw new Error(`필수 열이 없습니다: ${missingHeaders.join(", ")}`);
  }
  if (unknownHeaders.length > 0) {
    throw new Error(`알 수 없는 열이 있습니다: ${unknownHeaders.join(", ")}`);
  }
  if (new Set(header).size !== header.length) throw new Error("중복된 열 이름이 있습니다.");

  return rows.flatMap((cells, rowIndex) => {
    if (cells.every((value) => value.trim() === "")) return [];
    if (cells.length > header.length) {
      throw new Error(`${rowIndex + 2}행의 열 개수가 헤더보다 많습니다.`);
    }

    const values = Object.fromEntries(
      modelCsvHeaders.map((name) => {
        const columnIndex = header.indexOf(name);
        return [name, columnIndex >= 0 ? (cells[columnIndex] ?? "").trim() : ""];
      }),
    ) as Record<ModelCsvHeader, string>;

    return [{ rowNumber: rowIndex + 2, values }];
  });
}

function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function isReleaseDate(value: string): boolean {
  const monthMatch = /^(\d{4})-(\d{2})$/.exec(value);
  if (monthMatch) {
    const month = Number(monthMatch[2]);
    return month >= 1 && month <= 12;
  }

  return isIsoDate(value);
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateModelCsv(
  records: ParsedCsvRecord[],
  context: CatalogCsvValidationContext,
): CatalogCsvValidationResult {
  const errors: string[] = [];
  const entries: ImportedCatalogEntry[] = [];
  const csvIds = new Set<string>();
  const csvCodes = new Set<string>();
  let draftCount = 0;
  let publishedCount = 0;

  for (const { rowNumber, values } of records) {
    const prefix = `${rowNumber}행`;
    const status = values.status as ModelCsvStatus;
    if (status !== "draft" && status !== "published") {
      errors.push(`${prefix}: status는 draft 또는 published여야 합니다.`);
    }

    for (const field of ["category", "brandId", "modelName", "modelCode"] as const) {
      if (!values[field]) errors.push(`${prefix}: ${field} 값이 필요합니다.`);
    }

    if (!context.categoryIds.has(values.category)) {
      errors.push(`${prefix}: 등록되지 않은 category입니다: ${values.category || "(빈 값)"}`);
    }

    const supportedCategories = context.brandCategories.get(values.brandId);
    if (!supportedCategories) {
      errors.push(`${prefix}: 등록되지 않은 brandId입니다: ${values.brandId || "(빈 값)"}`);
    } else if (values.category && !supportedCategories.has(values.category)) {
      errors.push(`${prefix}: ${values.brandId} 브랜드에 ${values.category} 카테고리가 없습니다.`);
    }

    const id = toModelId(values.brandId, values.modelCode);
    const normalizedCode = values.modelCode.toLowerCase().replace(/[\s-]/g, "");
    if (csvIds.has(id)) errors.push(`${prefix}: CSV 안에서 모델 ID가 중복됩니다: ${id}`);
    if (csvCodes.has(normalizedCode)) {
      errors.push(`${prefix}: CSV 안에서 모델번호가 중복됩니다: ${values.modelCode}`);
    }
    if (context.existingModelIds.has(id))
      errors.push(`${prefix}: 기존 모델 ID와 중복됩니다: ${id}`);
    if (context.existingModelCodes.has(normalizedCode)) {
      errors.push(`${prefix}: 기존 모델번호와 중복됩니다: ${values.modelCode}`);
    }
    csvIds.add(id);
    csvCodes.add(normalizedCode);

    if (values.sourceUrl && !isHttpsUrl(values.sourceUrl)) {
      errors.push(`${prefix}: sourceUrl은 https 주소여야 합니다.`);
    }
    if (values.releaseSourceUrl && !isHttpsUrl(values.releaseSourceUrl)) {
      errors.push(`${prefix}: releaseSourceUrl은 https 주소여야 합니다.`);
    }
    if (values.sourceType && !sourceTypes.has(values.sourceType as SourceReference["sourceType"])) {
      errors.push(`${prefix}: sourceType 값이 올바르지 않습니다: ${values.sourceType}`);
    }
    if (values.verifiedAt && !isIsoDate(values.verifiedAt)) {
      errors.push(`${prefix}: verifiedAt은 YYYY-MM-DD 형식이어야 합니다.`);
    }
    if (values.releaseDate && !isReleaseDate(values.releaseDate)) {
      errors.push(`${prefix}: releaseDate는 YYYY-MM 또는 YYYY-MM-DD 형식이어야 합니다.`);
    }
    if (Boolean(values.releaseDate) !== Boolean(values.releaseSourceUrl)) {
      errors.push(`${prefix}: releaseDate와 releaseSourceUrl은 함께 입력해야 합니다.`);
    }

    if (status === "draft") {
      draftCount += 1;
      continue;
    }

    publishedCount += 1;
    for (const field of ["sourceUrl", "sourceTitle", "sourceType", "verifiedAt"] as const) {
      if (!values[field]) errors.push(`${prefix}: published 행에는 ${field} 값이 필요합니다.`);
    }

    entries.push({
      brandId: values.brandId,
      category: values.category as ApplianceCategory,
      modelName: values.modelName,
      modelCode: values.modelCode,
      series: values.series || undefined,
      sourceUrl: values.sourceUrl,
      sourceTitle: values.sourceTitle,
      sourceType: (values.sourceType || "manufacturer") as SourceReference["sourceType"],
      verifiedAt: values.verifiedAt,
      releaseDate: values.releaseDate || undefined,
      releaseSourceUrl: values.releaseSourceUrl || undefined,
      aliases: values.aliases
        ? values.aliases
            .split("|")
            .map((alias) => alias.trim())
            .filter(Boolean)
        : undefined,
    });
  }

  return { entries, errors, draftCount, publishedCount };
}
