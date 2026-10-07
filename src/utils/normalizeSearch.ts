const BRAND_ALIASES: Record<string, string> = {
  엘지전자: "lg",
  엘지: "lg",
  lg전자: "lg",
  삼성전자: "samsung",
  삼성: "samsung",
  로보락: "roborock",
  위닉스: "winix",
  코웨이: "coway",
  드리미: "dreame",
  쿠쿠: "cuckoo",
  다이슨: "dyson",
  샤오미: "xiaomi",
  sk매직: "skmagic",
  교원웰스: "wells",
  웰스: "wells",
  블루에어: "blueair",
  에코백스: "ecovacs",
  나르왈: "narwal",
  아이로봇: "irobot",
  에브리봇: "everybot",
  유피: "eufy",
};

const BRAND_ALIAS_ENTRIES = Object.entries(BRAND_ALIASES).sort(
  ([left], [right]) => right.length - left.length,
);

function replaceLeadingBrandAlias(value: string): string {
  const match = BRAND_ALIAS_ENTRIES.find(([alias]) => value.startsWith(alias));
  if (!match) return value;

  const [alias, brandId] = match;
  return `${brandId}${value.slice(alias.length)}`;
}

export function normalizeSearch(value: string): string {
  const cleaned = value
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .trim()
    .replace(/[\s\-_]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

  return replaceLeadingBrandAlias(cleaned);
}

export function expandBrandAliases(value: string): string[] {
  const normalized = normalizeSearch(value);
  return [...new Set([normalized, BRAND_ALIASES[normalized] ?? normalized])];
}
