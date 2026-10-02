function expandModelCodes(value: string): string[] {
  const [primary, ...shortCodes] = value.toUpperCase().split("/");
  if (!primary) return [];

  return [
    primary,
    ...shortCodes.map((shortCode) => {
      if (shortCode.length >= primary.length) return shortCode;
      return primary.slice(0, primary.length - shortCode.length) + shortCode;
    }),
  ];
}

export function formatPackageLabelForModel(label: string, modelCode: string): string {
  const segments = label.split(" · ");
  const detail = segments.pop()?.trim();
  if (!detail) return label;

  const normalizedModelCode = modelCode.toUpperCase();
  const clauses = detail.split(/\s*,\s*/);

  for (const clause of clauses) {
    const match = clause.match(/^([A-Z0-9-]+(?:\/[A-Z0-9-]+)*)(?:은|는)?\s+(.+)$/i);
    if (!match) continue;

    const [, encodedCodes, description] = match;
    if (!expandModelCodes(encodedCodes).includes(normalizedModelCode)) continue;

    const currentModelDetail = `${modelCode} ${description}`;
    return [...segments, currentModelDetail].join(" · ");
  }

  return label;
}
