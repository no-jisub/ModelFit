import { consumables } from "../src/data/consumables";

interface SourceAuditTarget {
  url: string;
  partIds: string[];
}

interface SourceAuditResult extends SourceAuditTarget {
  status: "ok" | "blocked" | "failed";
  httpStatus?: number;
  resolvedUrl?: string;
  error?: string;
}

const targets = [
  ...consumables
    .flatMap((part) => part.sources.map((source) => ({ url: source.url, partId: part.id })))
    .reduce((entries, item) => {
      const existing = entries.get(item.url) ?? { url: item.url, partIds: [] };
      existing.partIds.push(item.partId);
      entries.set(item.url, existing);
      return entries;
    }, new Map<string, SourceAuditTarget>())
    .values(),
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
  `공식 출처 접근 감사: 전체 ${results.length}, 정상 ${counts.ok}, 접근 차단 ${counts.blocked}, 실패 ${counts.failed}`,
);

for (const result of results.filter((item) => item.status !== "ok")) {
  const detail = result.httpStatus ? `HTTP ${result.httpStatus}` : result.error;
  console.log(`[${result.status}] ${detail} ${result.url} (${result.partIds.length}개 항목)`);
}

if (counts.failed > 0) process.exitCode = 1;
