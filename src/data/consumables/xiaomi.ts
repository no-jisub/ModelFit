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
    compatibleProductName: "B105GL-TB · 물걸레 패드 2개입",
    genuinePartNumber: "B105GL-TB",
    compatibleModelIds: ["xiaomi-5-pro", "xiaomi-5"],
    searchKeywords: ["Xiaomi Robot Vacuum 5 5 Pro Mop Pad", "샤오미 5 Pro 물걸레 패드"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Xiaomi 글로벌 공식 액세서리 사양 — 5·5 Pro 호환 물걸레 패드",
        "https://www.mi.com/global/product/xiaomi-robot-vacuum-s10-plus-mop-pad/specs/",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("샤오미 로봇청소기 5 Pro 정품 물걸레 패드"),
  },
  ...(
    [
      [
        "xiaomi-s20-dust-bin-filter",
        "dust-bin-filter",
        "Xiaomi S20 먼지통 필터",
        "B112-CH",
        "2개입",
        "3~6개월",
        "필터는 매주 청소하세요.",
      ],
      [
        "xiaomi-s20-main-brush",
        "main-brush",
        "Xiaomi S20 메인 브러시",
        "B112-ZS",
        "1개입",
        "6~12개월",
        "메인 브러시는 매주 청소하세요.",
      ],
      [
        "xiaomi-s20-side-brush",
        "side-brush",
        "Xiaomi S20 사이드 브러시",
        "B106GL-BX",
        "2개입",
        "3~6개월",
        "사이드 브러시는 한 달마다 청소하세요.",
      ],
      ["xiaomi-s20-mop-pad", "mop-pad", "Xiaomi S20 물걸레 패드", "D106-TB", "2개입", "3개월", ""],
    ] as const
  ).map(([id, type, displayName, genuinePartNumber, quantity, interval, care]) => ({
    ...researchedPart({
      id,
      type,
      displayName,
      genuinePartNumber,
      compatibleProductName: `${genuinePartNumber} · ${quantity}`,
      modelIds: ["xiaomi-s20"],
      sourceTitle: "Xiaomi 글로벌 공식 S20 액세서리 사양",
      sourceUrl: "https://www.mi.com/global/product/xiaomi-robot-vacuum-s20-accessories/specs/",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} ${genuinePartNumber}`,
      regional: true,
      verifiedAt: "2026-09-09",
      replacementInterval: `${interval} (사용 환경과 마모 상태에 따라 달라질 수 있음)`,
      secondarySources: [
        {
          title: "Xiaomi 공식 S20 소모품 청소 및 교체 주기",
          url: "https://www.mi.com/global/support/faq/details/KA-233343/",
          sourceType: "manufacturer",
        },
      ],
    }),
    purchaseWarning: `${regionalWarning} ${care}`.trim(),
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
      sourceType: "manufacturer",
      searchKeyword,
      regional: true,
      verifiedAt: "2026-09-09",
      replacementInterval: `${type === "main-brush" ? "6~12개월" : type === "dust-bag" ? "약 2.5개월" : "3~6개월"} (실제 사용량과 마모 상태에 따라 달라질 수 있음)`,
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
      sourceTitle:
        type === "dust-bin-filter"
          ? "샤오미 공식 X10+ 필터 및 소모품 관리 안내"
          : "샤오미 코리아 공식 X10+ 액세서리 사양",
      sourceUrl:
        type === "dust-bin-filter"
          ? "https://www.mi.com/ph/support/faq/details/KA-11678/"
          : "https://www.mi.com/kr/product/xiaomi-robot-vacuum-x10-plus-accessories/specs/",
      sourceType: "manufacturer",
      searchKeyword,
      replacementInterval:
        type === "dust-bag"
          ? "사용량에 따라 필요 시 교체 (해외 공식 FAQ 권장 4~6주)"
          : `${type === "main-brush" ? "6~12개월" : type === "mop-pad" ? "1~3개월" : "3~6개월"} (사용 환경과 마모 상태에 따라 달라질 수 있음)`,
      secondarySources: [
        {
          title: "샤오미 공식 X10+ 소모품 관리 및 교체 주기 FAQ",
          url: "https://www.mi.com/ph/support/faq/details/KA-11678/",
          sourceType: "manufacturer",
        },
      ],
    }),
  ),
  researchedPart({
    id: "xiaomi-5-series-anti-tangle-side-brush",
    type: "side-brush",
    displayName: "Xiaomi Robot Vacuum 5·5 Pro 엉킴 방지 사이드 브러시",
    compatibleProductName: "OV81GL-BS · 사이드 브러시 2개입",
    genuinePartNumber: "OV81GL-BS",
    modelIds: ["xiaomi-5", "xiaomi-5-pro"],
    sourceTitle: "Xiaomi Global 공식 액세서리 — 5·5 Pro 엉킴 방지 사이드 브러시",
    sourceUrl:
      "https://www.mi.com/global/product/xiaomi-robot-vacuum-anti-tangle-side-brush/specs/",
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
