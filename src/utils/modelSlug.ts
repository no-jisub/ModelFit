export function toModelSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/°/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toModelId(brandId: string, modelCode: string): string {
  return `${brandId}-${toModelSlug(modelCode)}`;
}
