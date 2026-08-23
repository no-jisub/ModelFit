import {
  affiliate,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const dreameConsumableRecords: ConsumableRecord[] = [
  ...(
    [
      ["dreame-x40-main-brush", "main-brush", "Dreame X40 Ultra 메인 브러시", "Main Brush ×1"],
      ["dreame-x40-side-brush", "side-brush", "Dreame X40 Ultra 사이드 브러시", "Side Brush ×2"],
      ["dreame-x40-dust-bag", "dust-bag", "Dreame X40 Ultra 먼지봉투", "Dust Collection Bag ×2"],
      [
        "dreame-x40-dust-box-filter",
        "dust-bin-filter",
        "Dreame X40 Ultra 먼지통 필터",
        "Dust Box Filter ×2",
      ],
      ["dreame-x40-mop-pad", "mop-pad", "Dreame X40 Ultra 물걸레 패드", "Wash-free Mop Pad ×6"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) => ({
    id,
    slug: id,
    type,
    displayName,
    compatibleProductName: `X40 Ultra Accessory Cleaning Kit 포함 ${compatibleProductName}`,
    compatibleModelIds: ["dreame-x40-ultra"],
    searchKeywords: ["Dreame X40 Ultra Accessory Cleaning Kit", displayName],
    purchaseWarning: regionalWarning,
    verificationStatus: "official" as const,
    sources: [
      source(
        "Dreame 공식몰 — X40 Ultra 액세서리 클리닝 키트 구성과 호환 모델",
        "https://www.dreametech.com/products/x40-ultra-accessory-cleaning-kit",
      ),
    ],
    affiliate: affiliate(`${displayName} 정품`),
  })),
  ...(
    [
      ["dreame-x50s-main-brush", "main-brush", "드리미 X50s Pro 메인 브러시"],
      ["dreame-x50s-side-brush", "side-brush", "드리미 X50s Pro 사이드 브러시"],
      ["dreame-x50s-dust-box-filter", "dust-bin-filter", "드리미 X50s Pro 먼지통 필터"],
      ["dreame-x50s-mop-pad", "mop-pad", "드리미 X50s Pro 물걸레 패드"],
      ["dreame-x50s-dust-bag", "dust-bag", "드리미 X50s Pro 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["dreame-x50s-pro-master", "dreame-x50s-pro-ultra"],
      sourceTitle: "드리미 코리아 공식 X50s Pro 제품 및 구성품 안내",
      sourceUrl:
        "https://store.kr.dreametech.com/products/%EB%93%9C%EB%A6%AC%EB%AF%B8-x50s-pro-ultra-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
    }),
  ),
  ...(
    [
      ["dreame-x40s-main-brush", "main-brush", "드리미 X40s Pro Ultra 메인 브러시"],
      ["dreame-x40s-side-brush", "side-brush", "드리미 X40s Pro Ultra 사이드 브러시"],
      ["dreame-x40s-filter", "dust-bin-filter", "드리미 X40s Pro Ultra 먼지통 필터"],
      ["dreame-x40s-mop-pad", "mop-pad", "드리미 X40s Pro Ultra 물걸레 패드"],
      ["dreame-x40s-dust-bag", "dust-bag", "드리미 X40s Pro Ultra 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["dreame-x40s-pro-ultra"],
      sourceTitle: "드리미 코리아 공식 X40s Pro Ultra 제품 안내",
      sourceUrl: "https://kr.dreametech.com/products?category=15",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
    }),
  ),
  ...(
    [
      ["dreame-l10s-heat-main-brush", "main-brush", "드리미 L10s Pro Ultra Heat 메인 브러시"],
      ["dreame-l10s-heat-side-brush", "side-brush", "드리미 L10s Pro Ultra Heat 사이드 브러시"],
      ["dreame-l10s-heat-mop-pad", "mop-pad", "드리미 L10s Pro Ultra Heat 물걸레 패드"],
      ["dreame-l10s-heat-dust-bag", "dust-bag", "드리미 L10s Pro Ultra Heat 3.2L 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["dreame-l10s-pro-ultra-heat"],
      sourceTitle: "드리미 공식 L10s Pro Ultra Heat 제품 구성",
      sourceUrl: "https://global.dreametech.com/products/l10s-pro-ultra",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
];
