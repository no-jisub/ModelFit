export const REPORT_CATEGORIES = ["model", "consumable", "compatibility", "other"] as const;
export const REPORT_STATUSES = ["received", "reviewing", "resolved", "rejected"] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface ReportInput {
  category: ReportCategory;
  productName: string;
  pageUrl: string;
  description: string;
  evidenceUrl?: string;
}

export interface StoredReport extends ReportInput {
  id: string;
  status: ReportStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
  expiresAt: Date | null;
}

export const REPORT_LIMITS = {
  productName: 120,
  pageUrl: 500,
  description: 2000,
  evidenceUrl: 500,
} as const;

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function normalizeReportInput(input: ReportInput): ReportInput {
  return {
    category: input.category,
    productName: input.productName.trim(),
    pageUrl: input.pageUrl.trim(),
    description: input.description.trim(),
    evidenceUrl: input.evidenceUrl?.trim() || undefined,
  };
}

export function validateReportInput(input: ReportInput): string[] {
  const normalized = normalizeReportInput(input);
  const errors: string[] = [];

  if (!REPORT_CATEGORIES.includes(normalized.category)) errors.push("오류 유형을 선택해 주세요.");
  if (!normalized.productName) errors.push("제품명을 입력해 주세요.");
  if (normalized.productName.length > REPORT_LIMITS.productName)
    errors.push(`제품명은 ${REPORT_LIMITS.productName}자 이하여야 합니다.`);
  if (!isHttpUrl(normalized.pageUrl)) errors.push("오류가 있는 페이지 주소를 확인해 주세요.");
  if (normalized.pageUrl.length > REPORT_LIMITS.pageUrl)
    errors.push(`페이지 주소는 ${REPORT_LIMITS.pageUrl}자 이하여야 합니다.`);
  if (!normalized.description) errors.push("오류 내용을 입력해 주세요.");
  if (normalized.description.length > REPORT_LIMITS.description)
    errors.push(`오류 내용은 ${REPORT_LIMITS.description}자 이하여야 합니다.`);
  if (normalized.evidenceUrl && !isHttpUrl(normalized.evidenceUrl))
    errors.push("참고 URL을 확인해 주세요.");
  if ((normalized.evidenceUrl?.length ?? 0) > REPORT_LIMITS.evidenceUrl)
    errors.push(`참고 URL은 ${REPORT_LIMITS.evidenceUrl}자 이하여야 합니다.`);

  return errors;
}

export function reportExpiresAt(from = new Date()) {
  const expiresAt = new Date(from);
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);
  return expiresAt;
}
