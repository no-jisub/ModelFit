import { consumables } from "../src/data/consumables";
import { models } from "../src/data/models";

interface SourceAuditTarget {
  url: string;
  itemIds: string[];
  kind: "official-source" | "direct-purchase";
}

interface SourceAuditResult extends SourceAuditTarget {
  status: "ok" | "blocked" | "failed";
  httpStatus?: number;
  resolvedUrl?: string;
  error?: string;
}

const officialSourceTypes = new Set(["manufacturer", "official-manual", "official-store"]);
const sourceItems = [
  ...models.flatMap((model) =>
    model.sources
      .filter((source) => officialSourceTypes.has(source.sourceType))
      .map((source) => ({ url: source.url, itemId: model.id })),
  ),
  ...consumables.flatMap((part) =>
    part.sources
      .filter((source) => officialSourceTypes.has(source.sourceType))
      .map((source) => ({ url: source.url, itemId: part.id })),
  ),
];
const directPurchaseItems = consumables
  .flatMap((part) => part.purchaseLinks)
  .filter((link) => link.linkType === "direct-product")
  .map((link) => ({ url: link.url, itemId: link.id }));

const collectTargets = (
  items: Array<{ url: string; itemId: string }>,
  kind: SourceAuditTarget["kind"],
) => [
  ...items
    .reduce((entries, item) => {
      const existing = entries.get(item.url) ?? { url: item.url, itemIds: [], kind };
      existing.itemIds.push(item.itemId);
      entries.set(item.url, existing);
      return entries;
    }, new Map<string, SourceAuditTarget>())
    .values(),
];

const targets = [
  ...collectTargets(sourceItems, "official-source"),
  ...collectTargets(directPurchaseItems, "direct-purchase"),
];

async function auditSource(target: SourceAuditTarget): Promise<SourceAuditResult> {
  try {
    const response = await fetch(target.url, {
      headers: {
        accept: "text/html,application/pdf;q=0.9,*/*;q=0.8",
        "user-agent": "ModelFit source auditor/1.0",
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
  const results: SourceAuditResult[] = [];

  for (let index = 0; index < targets.length; index += batchSize) {
    const batch = targets.slice(index, index + batchSize);
    results.push(...(await Promise.all(batch.map(auditSource))));
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
  `외부 링크 접근 감사: 전체 ${results.length}, 정상 ${counts.ok}, 접근 차단 ${counts.blocked}, 실패 ${counts.failed}`,
);

for (const result of results.filter((item) => item.status !== "ok")) {
  const detail = result.httpStatus ? `HTTP ${result.httpStatus}` : result.error;
  console.log(
    `[${result.status}] ${result.kind} ${detail} ${result.url} (${result.itemIds.length}개 항목)`,
  );
}

if (counts.failed > 0) process.exitCode = 1;
