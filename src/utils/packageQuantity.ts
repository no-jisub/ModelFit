// Count only a single, explicit product quantity; mixed kits and sets are ambiguous.
export function getPackageQuantity(label?: string): number | undefined {
  if (!label || /[+·,/]|세트|확인/.test(label)) return undefined;
  const match = label.trim().match(/(?:^|\s)([1-9]\d*)개(?:입)?$/);
  return match ? Number(match[1]) : undefined;
}
