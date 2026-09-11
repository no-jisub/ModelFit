import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";

type LinkKind =
  | "model-source"
  | "consumable-source"
  | "product-option-source"
  | "purchase-link"
  | "product-option-purchase-link"
  | "affiliate-direct"
  | "external-asset";

interface LinkItem {
  url: string;
  itemId: string;
  kind: LinkKind;
}

interface AuditTarget {
  url: string;
  references: Array<{ itemId: string; kind: LinkKind }>;
}

interface AuditResult extends AuditTarget {
  status: "ok" | "blocked" | "failed";
  httpStatus?: number;
  resolvedUrl?: string;
  error?: string;
}

const staticExternalAssets: LinkItem[] = [
  {
    url: "https://link.coupang.com/a/glymSz5RDg",
    itemId: "coupang-category-banner-desktop",
    kind: "purchase-link",
  },
  {
    url: "https://link.coupang.com/a/glypBvXwVE",
    itemId: "coupang-category-banner-mobile",
    kind: "purchase-link",
  },
  {
    url: "https://ads-partners.coupang.com/banners/1019534?trackingCode=AF8213102&subId=&traceId=V0-301-5f9bd61900e673c0-I1019534&w=728&h=90",
    itemId: "coupang-category-banner-image-desktop",
    kind: "external-asset",
  },
  {
    url: "https://ads-partners.coupang.com/banners/1019540?trackingCode=AF8213102&subId=&traceId=V0-301-5f9bd61900e673c0-I1019540&w=320&h=100",
    itemId: "coupang-category-banner-image-mobile",
    kind: "external-asset",
  },
];

const linkItems: LinkItem[] = [
  ...models.flatMap((model) =>
    model.sources.map((source) => ({
      url: source.url,
      itemId: model.id,
      kind: "model-source" as const,
    })),
  ),
  ...consumables.flatMap((part) => [
    ...part.sources.map((source) => ({
      url: source.url,
      itemId: part.id,
      kind: "consumable-source" as const,
    })),
    ...part.productOptions.flatMap((option) =>
      option.sources.map((source) => ({
        url: source.url,
        itemId: `${part.id}/${option.id}`,
        kind: "product-option-source" as const,
      })),
    ),
    ...part.purchaseLinks.map((link) => ({
      url: link.url,
      itemId: `${part.id}/${link.id}`,
      kind: "purchase-link" as const,
    })),
    ...part.productOptions.flatMap((option) =>
      option.purchaseLinks.map((link) => ({
        url: link.url,
        itemId: `${part.id}/${option.id}/${link.id}`,
        kind: "product-option-purchase-link" as const,
      })),
    ),
    ...(part.affiliate.directUrl
      ? [
          {
            url: part.affiliate.directUrl,
            itemId: part.id,
            kind: "affiliate-direct" as const,
          },
        ]
      : []),
  ]),
  ...staticExternalAssets,
];

const targets = [
  ...linkItems
    .reduce((entries, item) => {
      const existing = entries.get(item.url) ?? { url: item.url, references: [] };
      existing.references.push({ itemId: item.itemId, kind: item.kind });
      entries.set(item.url, existing);
      return entries;
    }, new Map<string, AuditTarget>())
    .values(),
];

async function auditLink(target: AuditTarget): Promise<AuditResult> {
  try {
    const response = await fetch(target.url, {
      headers: {
        accept: "text/html,application/pdf,image/*;q=0.9,*/*;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; ModelFitLinkAuditor/2.0)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    await response.body?.cancel();

    const status = [401, 403, 429].includes(response.status)
      ? "blocked"
      : response.ok
        ? "ok"
        : "failed";

    return {
      ...target,
      status,
      httpStatus: response.status,
      resolvedUrl: response.url,
    };
  } catch (error) {
    return {
      ...target,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function auditInBatches(batchSize = 8) {
  const results: AuditResult[] = [];

  for (let index = 0; index < targets.length; index += batchSize) {
    const batch = targets.slice(index, index + batchSize);
    results.push(...(await Promise.all(batch.map(auditLink))));
  }

  return results;
}

const results = await auditInBatches();
const counts = results.reduce(
  (summary, result) => {
    summary[result.status] += 1;
    return summary;
  },
  { ok: 0, blocked: 0, failed: 0 },
);

console.log(
  `외부 링크 접근 감사: 참조 ${linkItems.length}, 고유 URL ${results.length}, 정상 ${counts.ok}, 접근 차단 ${counts.blocked}, 실패 ${counts.failed}`,
);

for (const result of results.filter((item) => item.status !== "ok")) {
  const detail = result.httpStatus ? `HTTP ${result.httpStatus}` : result.error;
  const kinds = [...new Set(result.references.map((reference) => reference.kind))].join(",");
  console.log(
    `[${result.status}] ${kinds} ${detail} ${result.url} (${result.references.length}개 참조)${
      result.resolvedUrl && result.resolvedUrl !== result.url ? ` -> ${result.resolvedUrl}` : ""
    }`,
  );
}

if (counts.failed > 0) process.exitCode = 1;
