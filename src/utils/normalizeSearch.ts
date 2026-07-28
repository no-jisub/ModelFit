const BRAND_ALIASES: Record<string, string> = {
  엘지: "lg",
  lg전자: "lg",
  삼성전자: "samsung",
  삼성: "samsung",
  로보락: "roborock",
  위닉스: "winix",
  코웨이: "coway",
  드리미: "dreame",
};

export function normalizeSearch(value: string): string {
  const cleaned = value
    .toLocaleLowerCase("ko-KR")
    .trim()
    .replace(/[\s\-_]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

  return BRAND_ALIASES[cleaned] ?? cleaned;
}

export function expandBrandAliases(value: string): string[] {
  const normalized = normalizeSearch(value);
  return [...new Set([normalized, BRAND_ALIASES[normalized] ?? normalized])];
}
