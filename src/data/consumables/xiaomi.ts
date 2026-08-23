import {
  affiliate,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const xiaomiConsumableRecords: ConsumableRecord[] = [
  {
    id: "xiaomi-5-series-mop-pad",
    slug: "xiaomi-5-series-mop-pad",
    type: "mop-pad",
    displayName: "Xiaomi 로봇청소기 5·5 Pro 물걸레 패드",
    compatibleProductName: "Xiaomi Robot Vacuum 5/5 Pro Mop Pad",
    compatibleModelIds: ["xiaomi-5-pro", "xiaomi-5"],
    searchKeywords: ["Xiaomi Robot Vacuum 5 5 Pro Mop Pad", "샤오미 5 Pro 물걸레 패드"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Xiaomi 글로벌 공식 액세서리 목록 — 5·5 Pro 물걸레 패드",
        "https://www.mi.com/global/product-list/vacuum-cleaner/vacuum-cleaner-accessories/",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("샤오미 로봇청소기 5 Pro 정품 물걸레 패드"),
  },
  ...(
    [
      ["xiaomi-s20-dust-bin-filter", "dust-bin-filter", "Xiaomi S20 먼지통 필터", "Filter"],
      ["xiaomi-s20-main-brush", "main-brush", "Xiaomi S20 메인 브러시", "Main brush"],
      ["xiaomi-s20-side-brush", "side-brush", "Xiaomi S20 사이드 브러시", "Side brush"],
      ["xiaomi-s20-mop-pad", "mop-pad", "Xiaomi S20 물걸레 패드", "Mop pad"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) => ({
    id,
    slug: id,
    type,
    displayName,
    compatibleProductName,
    compatibleModelIds: ["xiaomi-s20"],
    searchKeywords: [`Xiaomi Robot Vacuum S20 ${compatibleProductName}`, displayName],
    purchaseWarning: regionalWarning,
    verificationStatus: "official" as const,
    sources: [
      source(
        "Xiaomi 공식 S20 액세서리 페이지",
        "https://www.mi.com/uk/product/xiaomi-robot-vacuum-s20-accessories/",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(`${displayName} 정품`),
  })),
  ...(
    [
      [
        "xiaomi-x20-plus-filter",
        "dust-bin-filter",
        "샤오미 X20+ 먼지통 필터",
        "샤오미 X20+ 정품 필터",
      ],
      [
        "xiaomi-x20-plus-main-brush",
        "main-brush",
        "샤오미 X20+ 메인 브러시",
        "샤오미 X20+ 정품 메인 브러시",
      ],
      [
        "xiaomi-x20-plus-side-brush",
        "side-brush",
        "샤오미 X20+ 사이드 브러시",
        "샤오미 X20+ 정품 사이드 브러시",
      ],
      [
        "xiaomi-x20-plus-mop-pad",
        "mop-pad",
        "샤오미 X20+ 물걸레 패드",
        "샤오미 X20+ 정품 물걸레 패드",
      ],
      [
        "xiaomi-x20-plus-dust-bag",
        "dust-bag",
        "샤오미 X20+ 일회용 먼지봉투",
        "샤오미 X20+ 정품 먼지봉투",
      ],
    ] as const
  ).map(([id, type, displayName, searchKeyword]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["xiaomi-x20-plus"],
      sourceTitle: "샤오미 공식 X20+ 사양 및 소모품 교체 안내",
      sourceUrl: "https://www.mi.com/global/support/faq/details/KA-226850/",
      sourceType: "official-manual",
      searchKeyword,
      regional: true,
    }),
  ),
  ...(
    [
      [
        "xiaomi-x10-plus-filter",
        "dust-bin-filter",
        "샤오미 X10+ 먼지통 필터",
        undefined,
        "샤오미 X10+ 정품 필터",
      ],
      [
        "xiaomi-x10-plus-main-brush",
        "main-brush",
        "샤오미 X10+ 메인 브러시",
        "B101CN-ZS",
        "샤오미 X10+ B101CN-ZS",
      ],
      [
        "xiaomi-x10-plus-side-brush",
        "side-brush",
        "샤오미 X10+ 사이드 브러시",
        "B101CN-BS",
        "샤오미 X10+ B101CN-BS",
      ],
      [
        "xiaomi-x10-plus-mop-pad",
        "mop-pad",
        "샤오미 X10+ 물걸레 패드",
        "B101CN-TB",
        "샤오미 X10+ B101CN-TB",
      ],
      [
        "xiaomi-x10-plus-dust-bag",
        "dust-bag",
        "샤오미 X10+ 일회용 먼지봉투",
        "B101CN-CHD",
        "샤오미 X10+ B101CN-CHD",
      ],
    ] as const
  ).map(([id, type, displayName, genuinePartNumber, searchKeyword]) =>
    researchedPart({
      id,
      type,
      displayName,
      genuinePartNumber,
      modelIds: ["xiaomi-x10-plus"],
      sourceTitle: "샤오미 코리아 공식 X10+ 액세서리 사양",
      sourceUrl: "https://www.mi.com/kr/product/xiaomi-robot-vacuum-x10-plus-accessories/specs/",
      sourceType: "manufacturer",
      searchKeyword,
    }),
  ),
  researchedPart({
    id: "xiaomi-5-series-anti-tangle-side-brush",
    type: "side-brush",
    displayName: "Xiaomi Robot Vacuum 5·5 Pro 엉킴 방지 사이드 브러시 2개입",
    compatibleProductName: "Robot Vacuum 5/5 Pro Anti-tangle Side Brush",
    genuinePartNumber: "OV81GL-BS",
    modelIds: ["xiaomi-5", "xiaomi-5-pro"],
    sourceTitle: "Xiaomi Global 공식 액세서리 — 5·5 Pro 엉킴 방지 사이드 브러시",
    sourceUrl: "https://www.mi.com/global/product/xiaomi-robot-vacuum-anti-tangle-side-brush/",
    searchKeyword: "Xiaomi OV81GL-BS 정품 사이드 브러시",
    regional: true,
    verifiedAt: "2026-08-04",
    secondarySources: [
      {
        title: "Xiaomi Global 공식 5 Pro 사양 — 사이드 브러시 구성 확인",
        url: "https://www.mi.com/global/product/xiaomi-robot-vacuum-5-pro/specs/",
        sourceType: "manufacturer",
      },
    ],
  }),
];
