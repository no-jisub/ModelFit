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
      directUrl:
        id === "xiaomi-s20-dust-bin-filter" || id === "xiaomi-s20-mop-pad"
          ? "https://link.coupang.com/a/haDJE4c9iS"
          : "https://link.coupang.com/a/haDKW0rDbw",
      affiliateProductOption: {
        name: `Xiaomi S20 호환 ${displayName.replace("Xiaomi S20 ", "")}`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Xiaomi S20 호환 소모품 옵션으로 표기한 타사 상품입니다. Xiaomi 정품이 아니며 구매 전에 필요한 옵션을 선택했는지 확인하세요.",
        partNumber: "Xiaomi S20 호환",
        packageLabel: "판매 페이지에서 선택 옵션과 수량 확인",
      },
      regional: true,
      verifiedAt: "2026-09-19",
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
      directUrl:
        id === "xiaomi-x20-plus-main-brush"
          ? "https://link.coupang.com/a/g0C342WMlF"
          : id === "xiaomi-x20-plus-side-brush"
            ? "https://link.coupang.com/a/g0Dpim0YOO"
            : id === "xiaomi-x20-plus-mop-pad"
              ? "https://link.coupang.com/a/g1XrugC8v6"
              : undefined,
      affiliateProductOption:
        id === "xiaomi-x20-plus-main-brush"
          ? {
              name: "B101GL-ZS 메인 브러시",
              kind: "genuine",
              verification: "seller-claimed",
              description:
                "판매 페이지가 Xiaomi X20+ 적용 액세서리로 표기한 상품입니다. 구성과 적용 모델을 구매 직전에 다시 확인하세요.",
              partNumber: "B101GL-ZS",
              packageLabel: "메인 브러시 1개",
            }
          : id === "xiaomi-x20-plus-side-brush"
            ? {
                name: "X10+·X20+ 호환 사이드 브러시",
                kind: "compatible",
                verification: "seller-claimed",
                description:
                  "판매 페이지가 Xiaomi X10+·X20+ 호환을 표기한 타사 사이드 브러시입니다. Xiaomi 정품이 아닙니다.",
                partNumber: "X10+·X20+ 호환",
                packageLabel: "사이드 브러시 2개",
              }
            : id === "xiaomi-x20-plus-mop-pad"
              ? {
                  name: "X10+·X20+ 호환 물걸레 패드",
                  kind: "compatible",
                  verification: "seller-claimed",
                  description:
                    "판매 페이지가 Xiaomi X10+·X20+ 호환 물걸레 패드로 표기한 타사 상품입니다. Xiaomi 정품이 아닙니다.",
                  partNumber: "X10+·X20+ 호환",
                  packageLabel: "판매 페이지에서 수량 확인",
                }
              : undefined,
      regional: true,
      verifiedAt: "2026-09-11",
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
      directUrl:
        id === "xiaomi-x10-plus-dust-bag"
          ? "https://link.coupang.com/a/g0CQHLyFJA"
          : id === "xiaomi-x10-plus-main-brush"
            ? "https://link.coupang.com/a/g0C342WMlF"
            : id === "xiaomi-x10-plus-side-brush"
              ? "https://link.coupang.com/a/g0Dpim0YOO"
              : id === "xiaomi-x10-plus-mop-pad"
                ? "https://link.coupang.com/a/g1XrugC8v6"
                : undefined,
      affiliateProductOption:
        id === "xiaomi-x10-plus-dust-bag"
          ? {
              name: "B101CN-CHD 일회용 먼지봉투",
              kind: "genuine",
              verification: "seller-claimed",
              description:
                "판매 페이지가 Xiaomi X10+용 B101CN-CHD 액세서리로 표기한 상품입니다. 판매자와 포장 표기를 구매 전에 확인하세요.",
              partNumber: "B101CN-CHD",
              packageLabel: "먼지봉투 5개",
            }
          : id === "xiaomi-x10-plus-main-brush"
            ? {
                name: "B101GL-ZS 메인 브러시",
                kind: "genuine",
                verification: "seller-claimed",
                description:
                  "판매 페이지가 Xiaomi X10+ 적용 액세서리로 표기한 상품입니다. 국내 공식 부품번호 B101CN-ZS와 판매 상품의 지역 코드가 다르므로 적용 모델을 구매 전에 확인하세요.",
                partNumber: "B101GL-ZS",
                packageLabel: "메인 브러시 1개",
              }
            : id === "xiaomi-x10-plus-side-brush"
              ? {
                  name: "X10+·X20+ 호환 사이드 브러시",
                  kind: "compatible",
                  verification: "seller-claimed",
                  description:
                    "판매 페이지가 Xiaomi X10+·X20+ 호환을 표기한 타사 사이드 브러시입니다. Xiaomi 정품이 아닙니다.",
                  partNumber: "X10+·X20+ 호환",
                  packageLabel: "사이드 브러시 2개",
                }
              : id === "xiaomi-x10-plus-mop-pad"
                ? {
                    name: "X10+·X20+ 호환 물걸레 패드",
                    kind: "compatible",
                    verification: "seller-claimed",
                    description:
                      "판매 페이지가 Xiaomi X10+·X20+ 호환 물걸레 패드로 표기한 타사 상품입니다. Xiaomi 정품이 아닙니다.",
                    partNumber: "X10+·X20+ 호환",
                    packageLabel: "판매 페이지에서 수량 확인",
                  }
                : undefined,
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
    id: "xiaomi-5-series-anti-tangle-main-brush",
    type: "main-brush",
    displayName: "Xiaomi Robot Vacuum 5·5 Pro 자동 헤어컷 메인 브러시",
    compatibleProductName: "D109GL-GMZS · 자동 헤어컷 메인 브러시 1개",
    genuinePartNumber: "D109GL-GMZS",
    modelIds: ["xiaomi-5", "xiaomi-5-pro"],
    sourceTitle: "Xiaomi 공식 X20 Max·5·5 Pro 자동 헤어컷 메인 브러시 사양",
    sourceUrl:
      "https://www.mi.com/global/product/xiaomi-robot-vacuum-x20-max-x20-pro-accessories/specs/",
    sourceType: "manufacturer",
    searchKeyword: "Xiaomi D109GL-GMZS 정품 자동 헤어컷 메인 브러시",
    directUrl: "https://link.coupang.com/a/haKL6MGbxk",
    affiliateProductOption: {
      name: "Xiaomi 5·5 Pro 자동 헤어컷 메인 브러시 D109GL-GMZS",
      kind: "genuine",
      verification: "seller-claimed",
      description:
        "판매 페이지가 Xiaomi 5·5 Pro 적용 D109GL-GMZS 액세서리로 표기한 상품입니다. 판매자와 포장 표기를 구매 전에 확인하세요.",
      partNumber: "D109GL-GMZS",
      packageLabel: "자동 헤어컷 메인 브러시 1개",
    },
    regional: true,
    verifiedAt: "2026-09-19",
  }),
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
    directUrl: "https://link.coupang.com/a/haMhNASgOy",
    affiliateProductOption: {
      name: "Xiaomi X20 Max·5 Pro 호환 소모품 세트",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 Xiaomi X20 Max·5 Pro용 브러시·필터·걸레·먼지봉투 옵션을 제공하는 타사 상품입니다. 사이드 브러시 옵션과 수량을 구매 전에 확인하세요.",
      partNumber: "Xiaomi 5 Pro 호환",
      packageLabel: "사이드 브러시 옵션 선택",
    },
    regional: true,
    verifiedAt: "2026-09-19",
    secondarySources: [
      {
        title: "Xiaomi Global 공식 5 Pro 사양 — 사이드 브러시 구성 확인",
        url: "https://www.mi.com/global/product/xiaomi-robot-vacuum-5-pro/specs/",
        sourceType: "manufacturer",
      },
    ],
  }),
];
