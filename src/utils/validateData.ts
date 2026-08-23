import type { ApplianceModel, Brand, ConsumableCompatibility } from "@/types";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

function isAllowedOfficialHost(hostname: string, domains: string[]) {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function isValidDomain(domain: string) {
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain);
}

export function validateData(
  brands: Brand[],
  models: ApplianceModel[],
  consumables: ConsumableCompatibility[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const brandIds = new Set(brands.map((brand) => brand.id));
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const modelIds = new Set(models.map((model) => model.id));
  const partIds = new Set(consumables.map((part) => part.id));

  const duplicates = (values: string[]) =>
    values.filter((value, index) => values.indexOf(value) !== index);

  for (const slug of duplicates(brands.map((brand) => brand.slug))) {
    errors.push(`중복 브랜드 slug: ${slug}`);
  }
  for (const brand of brands) {
    if (brand.officialDomains.length === 0) {
      errors.push(`${brand.id}: 공식 출처 도메인이 없습니다.`);
    }
    for (const domain of brand.officialDomains) {
      if (domain !== domain.toLowerCase() || !isValidDomain(domain)) {
        errors.push(`${brand.id}: 올바르지 않은 공식 출처 도메인 ${domain}`);
      }
    }
    for (const domain of duplicates(brand.officialDomains)) {
      errors.push(`${brand.id}: 중복 공식 출처 도메인 ${domain}`);
    }
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
    for (const source of model.sources) {
      if (Number.isNaN(Date.parse(source.checkedAt))) {
        errors.push(`${model.id}: invalid source check date ${source.checkedAt}.`);
      }

      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:") {
          errors.push(`${model.id}: source must use HTTPS ${source.url}.`);
        }

        if (["manufacturer", "official-manual", "official-store"].includes(source.sourceType)) {
          const domains = brandsById.get(model.brandId)?.officialDomains ?? [];
          if (!isAllowedOfficialHost(url.hostname, domains)) {
            errors.push(
              `${model.id}: source is outside the ${model.brandId} official domains ${source.url}.`,
            );
          }
        }
      } catch {
        errors.push(`${model.id}: invalid source URL ${source.url}.`);
      }
    }
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
    const partBrandIds = new Set(
      part.compatibleModelIds
        .map((modelId) => models.find((model) => model.id === modelId)?.brandId)
        .filter((brandId): brandId is string => Boolean(brandId)),
    );

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
    for (const source of part.sources) {
      if (Number.isNaN(Date.parse(source.checkedAt))) {
        errors.push(`${part.id}: invalid source check date ${source.checkedAt}.`);
      }

      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:") {
          errors.push(`${part.id}: source must use HTTPS ${source.url}.`);
        }

        if (["manufacturer", "official-manual", "official-store"].includes(source.sourceType)) {
          for (const brandId of partBrandIds) {
            const domains = brandsById.get(brandId)?.officialDomains ?? [];
            if (!isAllowedOfficialHost(url.hostname, domains)) {
              errors.push(
                `${part.id}: source is outside the ${brandId} official domains ${source.url}.`,
              );
            }
          }
        }
      } catch {
        errors.push(`${part.id}: invalid source URL ${source.url}.`);
      }
    }
    if (part.partNumberStatus === "confirmed" && !part.genuinePartNumber?.trim()) {
      errors.push(`${part.id}: confirmed part number status requires a genuine part number.`);
    }
    if (part.genuinePartNumber?.trim() && part.partNumberStatus !== "confirmed") {
      errors.push(`${part.id}: genuine part number must use confirmed status.`);
    }
    if (part.partNumberStatus === "not-listed" && part.sources.length === 0) {
      errors.push(`${part.id}: not-listed part number status requires a source.`);
    }
    if (part.affiliate.enabled && !part.affiliate.directUrl) {
      errors.push(`${part.id}: 활성화된 구매 링크 URL이 없습니다.`);
    }
    if (
      part.affiliate.status === "direct-product" &&
      !part.affiliate.directUrl?.includes("/vp/products/") &&
      !part.affiliate.directUrl?.startsWith("https://link.coupang.com/a/")
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
    if (part.affiliate.restrictionNote && part.affiliate.isAffiliate) {
      errors.push(`${part.id}: 생성 제한 상품을 제휴 링크로 표시할 수 없습니다.`);
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
        if (
          part.affiliate.isAffiliate !==
          (url.hostname === "link.coupang.com" && url.pathname.startsWith("/a/"))
        ) {
          errors.push(`${part.id}: 쿠팡 제휴 링크 여부와 URL이 일치하지 않습니다.`);
        }
      } catch {
        errors.push(`${part.id}: 잘못된 구매 링크 ${part.affiliate.directUrl}`);
      }
    }
    if (part.purchaseLinks.length < 2) {
      errors.push(`${part.id}: 공식·쿠팡 구매 경로가 모두 필요합니다.`);
    }
    if (part.purchaseLinks[0]?.channel !== "official") {
      errors.push(`${part.id}: 첫 구매 경로는 공식 사이트여야 합니다.`);
    }
    if (part.purchaseLinks[1]?.channel !== "coupang") {
      errors.push(`${part.id}: 두 번째 구매 경로는 쿠팡이어야 합니다.`);
    }
    const purchaseLinkIds = new Set<string>();
    for (const link of part.purchaseLinks) {
      if (purchaseLinkIds.has(link.id)) {
        errors.push(`${part.id}: 중복 구매 링크 ID ${link.id}`);
      }
      purchaseLinkIds.add(link.id);
      if (Number.isNaN(Date.parse(link.checkedAt))) {
        errors.push(`${part.id}: 구매 링크 확인일이 올바르지 않습니다.`);
      }
      try {
        const url = new URL(link.url);
        if (url.protocol !== "https:") {
          errors.push(`${part.id}: 구매 링크는 HTTPS여야 합니다 ${link.url}`);
        }
        if (link.channel === "coupang" && !url.hostname.endsWith("coupang.com")) {
          errors.push(`${part.id}: 쿠팡 외부 구매 링크 ${link.url}`);
        }
        if (
          link.isAffiliate &&
          (link.channel !== "coupang" ||
            url.hostname !== "link.coupang.com" ||
            !url.pathname.startsWith("/a/"))
        ) {
          errors.push(`${part.id}: 잘못 표시된 제휴 구매 링크 ${link.url}`);
        }
        if (link.channel === "coupang" && link.isAffiliate !== part.affiliate.isAffiliate) {
          errors.push(`${part.id}: 쿠팡 구매 링크의 제휴 상태가 원본 데이터와 다릅니다.`);
        }
      } catch {
        errors.push(`${part.id}: 잘못된 다중 구매 링크 ${link.url}`);
      }
    }
    if (part.productOptions.length === 0) {
      errors.push(`${part.id}: 소개할 상품 후보가 없습니다.`);
    }
    const productOptionIds = new Set<string>();
    for (const option of part.productOptions) {
      if (productOptionIds.has(option.id)) {
        errors.push(`${part.id}: 중복 상품 후보 ID ${option.id}`);
      }
      productOptionIds.add(option.id);
      if (option.kind === "genuine" && option.verification === "verified-compatible") {
        errors.push(`${part.id}: 정품을 호환상품 검증 상태로 표시할 수 없습니다.`);
      }
      if (option.kind === "compatible" && option.verification === "official-genuine") {
        errors.push(`${part.id}: 호환상품을 제조사 정품으로 표시할 수 없습니다.`);
      }
      if (option.purchaseLinks.some((link) => link.linkType === "search-results")) {
        errors.push(`${part.id}: 검색 결과 링크를 특정 상품 후보로 소개할 수 없습니다.`);
      }
      for (const link of option.purchaseLinks) {
        try {
          const url = new URL(link.url);
          if (url.protocol !== "https:") {
            errors.push(`${part.id}: 상품 후보 링크는 HTTPS여야 합니다 ${link.url}`);
          }
        } catch {
          errors.push(`${part.id}: 잘못된 상품 후보 링크 ${link.url}`);
        }
      }
    }
    if (
      part.verificationStatus === "official" &&
      !part.productOptions.some(
        (option) => option.kind === "genuine" && option.verification === "official-genuine",
      )
    ) {
      errors.push(`${part.id}: 공식 확인 소모품에는 정품 기준 상품이 필요합니다.`);
    }
    if (part.partNumberStatus === "researching") {
      warnings.push(`${part.id}: 정품 부품번호 추가 조사 필요`);
    }
  }

  return { errors, warnings };
}
