import { relationalCategories } from "./importedRelationalCatalog";

export const categories = relationalCategories;

export type CategoryId = (typeof categories)[number]["id"];
export type CategoryConfig = (typeof categories)[number];

export const categoryIds = categories.map(({ id }) => id) as CategoryId[];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, CategoryConfig>;

export function isApplianceCategory(value: string | null | undefined): value is CategoryId {
  return value !== null && value !== undefined && categoryIds.includes(value as CategoryId);
}

export function getCategoryConfig(category: CategoryId): CategoryConfig {
  return categoryById[category];
}
