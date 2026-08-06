import type { ApplianceModel, Brand, ConsumableCompatibility } from "@/types";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validateData(
  brands: Brand[],
  models: ApplianceModel[],
  consumables: ConsumableCompatibility[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const brandIds = new Set(brands.map((brand) => brand.id));
  const modelIds = new Set(models.map((model) => model.id));
  const partIds = new Set(consumables.map((part) => part.id));

  const duplicates = (values: string[]) =>
    values.filter((value, index) => values.indexOf(value) !== index);

  for (const slug of duplicates(brands.map((brand) => brand.slug))) {
    errors.push(`중복 브랜드 slug: ${slug}`);
  }
  for (const slug of duplicates(models.map((model) => model.slug))) {
    errors.push(`중복 모델 slug: ${slug}`);
  }
  for (const code of duplicates(models.map((model) => model.modelCode.toLowerCase()))) {
    errors.push(`중복 모델 코드: ${code}`);
  }
  for (const slug of duplicates(consumables.map((part) => part.slug))) {
    errors.push(`중복 소모품 slug: ${slug}`);
  }

  for (const model of models) {
    if (!brandIds.has(model.brandId)) errors.push(`${model.id}: 없는 브랜드 ${model.brandId}`);
    for (const partId of model.consumableIds) {
      if (!partIds.has(partId)) errors.push(`${model.id}: 없는 소모품 ${partId}`);
      const part = consumables.find((item) => item.id === partId);
      if (part && !part.compatibleModelIds.includes(model.id)) {
        errors.push(`${model.id}: ${partId}의 compatibleModelIds에 역참조가 없습니다.`);
      }
    }
    if (model.verificationStatus === "official" && model.sources.length === 0) {
      errors.push(`${model.id}: 공식 확인 모델에 출처가 없습니다.`);
    }
    if (!model.isDemo && model.sources.length === 0) {
      errors.push(`${model.id}: 실제 모델에 제조사 출처가 없습니다.`);
    }
    if (!model.isDemo && model.consumableIds.length === 0 && !model.consumableNote?.trim()) {
      errors.push(`${model.id}: 공식 소모품 또는 소모품 미등록 사유가 없습니다.`);
    }
    if (model.isDemo && model.verificationStatus !== "unverified") {
      errors.push(`${model.id}: 데모 모델은 미검증으로 표시해야 합니다.`);
    }
    if (
      model.releaseDate &&
      !/^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/.test(model.releaseDate)
    ) {
      errors.push(`${model.id}: 출시일은 YYYY-MM 또는 YYYY-MM-DD 형식이어야 합니다.`);
    }
  }

  for (const part of consumables) {
    for (const modelId of part.compatibleModelIds) {
      if (!modelIds.has(modelId)) errors.push(`${part.id}: 없는 모델 ${modelId}`);
      const model = models.find((item) => item.id === modelId);
      if (model && !model.consumableIds.includes(part.id)) {
        errors.push(`${part.id}: ${modelId}의 consumableIds에 역참조가 없습니다.`);
      }
    }
    if (part.verificationStatus === "official" && part.sources.length === 0) {
      errors.push(`${part.id}: 공식 확인 소모품에 출처가 없습니다.`);
    }
    if (part.affiliate.enabled && !part.affiliate.directUrl) {
      errors.push(`${part.id}: 활성화된 구매 링크 URL이 없습니다.`);
    }
    if (
      part.affiliate.status === "direct-product" &&
      !part.affiliate.directUrl?.includes("/vp/products/")
    ) {
      errors.push(`${part.id}: 직접 상품 링크 상태이지만 쿠팡 상품 URL이 아닙니다.`);
    }
    if (
      part.affiliate.status === "search-results" &&
      !part.affiliate.directUrl?.includes("/np/search")
    ) {
      errors.push(`${part.id}: 검색 링크 상태이지만 쿠팡 검색 URL이 아닙니다.`);
    }
    if (Number.isNaN(Date.parse(part.affiliate.linkCheckedAt))) {
      errors.push(`${part.id}: 구매 링크 확인일이 올바르지 않습니다.`);
    }
    if (
      part.affiliate.priceStatus === "manual-check-required" &&
      part.affiliate.stockStatus !== "manual-check-required"
    ) {
      warnings.push(`${part.id}: 가격과 재고의 수동 확인 상태가 다릅니다.`);
    }
    if (part.affiliate.directUrl) {
      try {
        const url = new URL(part.affiliate.directUrl);
        if (url.protocol !== "https:" || !url.hostname.endsWith("coupang.com")) {
          errors.push(`${part.id}: 허용되지 않은 쿠팡 링크 ${part.affiliate.directUrl}`);
        }
      } catch {
        errors.push(`${part.id}: 잘못된 구매 링크 ${part.affiliate.directUrl}`);
      }
    }
    if (!part.genuinePartNumber) warnings.push(`${part.id}: 정품 부품번호 정보 없음`);
  }

  return { errors, warnings };
}
