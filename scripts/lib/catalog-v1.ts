import type { CsvRow } from "./catalog-csv";
import { formatPackageLabelForModel } from "./migration-package-label";
/** Historical v1 display rules, used only while migrating verified backups. */
export function legacyConfiguration(options: CsvRow[], modelCode: string) {
  const rawLabel = [...options]
    .filter((o) => o.isActive !== "false")
    .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
    .find((o) => o.packageLabel)?.packageLabel;
  if (!rawLabel) return undefined;
  const label = formatPackageLabelForModel(rawLabel, modelCode);
  const segments = label.split(" · ").map((s) => s.trim());
  const itemCode = segments.length > 1 ? segments.shift() : undefined;
  const detail = segments.join(" · ") || label;
  const escaped = modelCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const quantity = detail.match(new RegExp("^" + escaped + "(?:은|는)?\\s+(.+?필요)$", "i"));
  if (quantity) return { itemCode, requiredQuantity: quantity[1] };
  const sale = detail.match(/^공식 판매 구성\s+(.+)$/);
  if (sale) return { itemCode, salesPackage: sale[1] };
  return { itemCode, composition: detail };
}
export function legacyMaintenance(part: CsvRow) {
  if (part.replacementInterval) return { mode: "정기 교체", detail: part.replacementInterval };
  const sentences = (part.purchaseWarning || "")
    .split(/(?<=\.)\s+/)
    .filter((s) => /교체 주기|세척해 재사용|상태에 따라 교체|마다.+청소/.test(s));
  if (!sentences.length) return undefined;
  const detail = sentences.join(" ");
  if (/상태에 따라 교체/.test(detail)) return { mode: "상태에 따라 교체", detail };
  return {
    mode: /세척해 재사용|교체 주기가 정해진/.test(detail) ? "세척 후 재사용" : "정기 관리",
    detail,
  };
}
