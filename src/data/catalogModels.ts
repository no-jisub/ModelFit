import type { ApplianceModel } from "@/types";
import { brands } from "./brands";
import { categoryById } from "./categories";
import { modelConsumableIds } from "./compatibilityMap";
import { importedCatalogModels } from "./importedCatalogModels";
import { modelImages } from "./modelImages";
import { toModelSlug } from "../utils/modelSlug";

export const catalogModels: ApplianceModel[] = importedCatalogModels.map((entry) => {
  const brand = brands.find(({ id }) => id === entry.brandId);
  if (!brand) throw new Error(`CSV 모델의 브랜드를 찾을 수 없습니다: ${entry.brandId}`);

  const brandName = brand.name;
  const brandNameEn = brand.nameEn ?? brand.name;
  const slug = toModelSlug(entry.modelCode);
  const id = `${entry.brandId}-${slug}`;

  return {
    id,
    slug,
    category: entry.category,
    brandId: entry.brandId,
    brandName,
    brandNameEn,
    modelName: entry.modelName,
    modelCode: entry.modelCode,
    aliases: Array.from(
      new Set([
        `${brandName} ${entry.modelCode}`,
        `${brandNameEn} ${entry.modelCode}`,
        entry.modelName,
        ...(entry.aliases ?? []),
      ]),
    ),
    series: entry.series,
    shortDescription: `제조사 공식 제품 또는 지원 자료에서 모델명이 확인된 ${categoryById[entry.category].label}입니다.`,
    image: modelImages[id],
    releaseDate: entry.releaseDate,
    consumableIds: modelConsumableIds[id] ?? [],
    sources: [
      {
        title: entry.sourceTitle,
        url: entry.sourceUrl,
        sourceType: entry.sourceType,
        checkedAt: entry.verifiedAt,
      },
      ...(entry.releaseSourceUrl
        ? [
            {
              title: "다나와 모델 등록월 정보",
              url: entry.releaseSourceUrl,
              sourceType: "other" as const,
              checkedAt: entry.verifiedAt,
            },
          ]
        : []),
    ],
    lastVerifiedAt: entry.verifiedAt,
    verificationStatus: "official",
    isDemo: false,
  };
});
