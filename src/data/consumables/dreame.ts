import {
  affiliate,
  domesticWarning,
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
    compatibleProductName: `X40 Ultra Accessory Cleaning Kit · ${compatibleProductName}`,
    compatibleModelIds: ["dreame-x40-ultra"],
    searchKeywords: ["Dreame X40 Ultra Accessory Cleaning Kit", displayName],
    purchaseWarning: `${regionalWarning} 표시 수량은 X40 Ultra/L40 Ultra 공식 액세서리 키트 한 세트의 구성입니다.`,
    verificationStatus: "official" as const,
    sources: [
      source(
        "Dreame 공식몰 — X40 Ultra/L40 Ultra 액세서리 키트 구성",
        "https://www.dreametech.com/products/x40-ultra-accessory-cleaning-kit",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      `${displayName} 정품`,
      id === "dreame-x40-main-brush"
        ? "https://link.coupang.com/a/hciQr6zTiK"
        : id === "dreame-x40-side-brush"
          ? "https://link.coupang.com/a/hciQ65CZIi"
          : id === "dreame-x40-dust-bag"
            ? "https://link.coupang.com/a/hcigM0CwRE"
            : id === "dreame-x40-dust-box-filter"
              ? "https://link.coupang.com/a/hciSyrJ7eK"
              : "https://link.coupang.com/a/hciUlZWiHs",
      "2026-09-20",
      undefined,
      {
        name: `${displayName.replace("Dreame ", "")} 호환상품`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          id === "dreame-x40-main-brush"
            ? "판매 페이지가 Dreame X40 Pro Ultra용 메인 브러시로 표기한 호환상품입니다. X40 Ultra 적용 모델과 구성 수량을 확인하세요."
            : id === "dreame-x40-side-brush"
              ? "판매 페이지가 Dreame X40·X40 Pro Ultra용 사이드 브러시로 표기한 호환상품입니다. 구성 수량을 확인하세요."
              : id === "dreame-x40-dust-bag"
                ? "판매 페이지가 Dreame X40 Ultra용 활성탄 먼지봉투로 표기한 호환상품입니다. 구성 수량을 구매 전에 확인하세요."
                : id === "dreame-x40-dust-box-filter"
                  ? "판매 페이지가 Dreame X40 Ultra Pro용 HEPA 필터 옵션을 제공하는 호환상품입니다. 먼지통 필터 옵션과 구성 수량을 확인하세요."
                  : "판매 페이지가 Dreame X40 Pro·X40 Ultra용 물걸레 옵션을 제공하는 호환상품입니다. 물걸레 옵션과 구성 수량을 확인하세요.",
        partNumber: "X40 Ultra 호환",
        packageLabel:
          id === "dreame-x40-main-brush"
            ? "메인 브러시 옵션"
            : id === "dreame-x40-side-brush"
              ? "사이드 브러시 옵션"
              : id === "dreame-x40-dust-bag"
                ? "활성탄 먼지봉투"
                : id === "dreame-x40-dust-box-filter"
                  ? "HEPA 필터 옵션"
                  : "물걸레 옵션",
      },
    ),
  })),
  ...(
    [
      [
        "dreame-x50s-main-brush",
        "main-brush",
        "드리미 X50s Pro 메인 브러시",
        "X50s Pro 메인 브러시",
      ],
      [
        "dreame-x50s-side-brush",
        "side-brush",
        "드리미 X50s Pro 사이드 브러시",
        "X50s Pro 사이드 브러시",
      ],
      [
        "dreame-x50s-dust-box-filter",
        "dust-bin-filter",
        "드리미 X50s Pro 먼지통 필터",
        "X50s Pro 먼지통 필터",
      ],
      ["dreame-x50s-mop-pad", "mop-pad", "드리미 X50s Pro 물걸레 패드", "X50s Pro 물걸레 패드"],
      [
        "dreame-x50s-dust-bag",
        "dust-bag",
        "드리미 X50s Pro 먼지봉투",
        "X50s Pro 스테이션 먼지봉투",
      ],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) => ({
    ...researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["dreame-x50s-pro-master", "dreame-x50s-pro-ultra"],
      sourceTitle: "드리미 코리아 공식 X50s Pro Ultra 제품 및 구성품 안내",
      sourceUrl:
        "https://store.kr.dreametech.com/products/%EB%93%9C%EB%A6%AC%EB%AF%B8-x50s-pro-ultra-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      secondarySources: [
        {
          title: "드리미 코리아 공식 X50s Pro Master 제품 및 Master·Ultra 차이 안내",
          url: "https://store.kr.dreametech.com/products/%EB%93%9C%EB%A6%AC%EB%AF%B8-x50s-pro-master-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
          sourceType: "manufacturer",
        },
      ],
      directUrl: "https://link.coupang.com/a/haA0FMhjFs",
      affiliateProductOption: {
        name: `X50s Pro Ultra ${compatibleProductName} 호환 옵션`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 드리미 X50s Pro Ultra용 필터·브러시·먼지봉투·물걸레 소모품 옵션을 제공하는 호환상품입니다. 사용하는 부품 종류와 구성 수량을 구매 전에 확인하세요.",
        packageLabel: "선택 옵션의 구성 확인 필요",
      },
      verifiedAt: "2026-09-19",
    }),
    purchaseWarning: `${domesticWarning} X50s Pro Master와 Ultra는 로봇 본체 사양은 같지만 스테이션 형태가 다릅니다. 구매 직전 판매 페이지에 두 모델 중 사용하는 모델이 명시됐는지 확인하세요.`,
  })),
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
      compatibleProductName: displayName.replace("드리미 ", ""),
      modelIds: ["dreame-x40s-pro-ultra"],
      sourceTitle: "드리미 코리아 공식 X40 시리즈 — X40s Pro Ultra 제품 안내",
      sourceUrl: "https://kr.dreametech.com/products?category=15",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      verifiedAt: id === "dreame-x40s-dust-bag" ? "2026-09-20" : "2026-09-11",
      directUrl:
        id === "dreame-x40s-dust-bag" ? "https://link.coupang.com/a/hcigM0CwRE" : undefined,
      affiliateProductOption:
        id === "dreame-x40s-dust-bag"
          ? {
              name: "드리미 X40 Ultra 활성탄 먼지봉투 호환상품",
              kind: "compatible",
              verification: "seller-claimed",
              description:
                "판매 페이지는 X40 Ultra용 활성탄 먼지봉투로 표기합니다. 동일 규격 3.2L 먼지봉투가 X40s Pro Ultra에도 적용된다는 별도 호환 자료를 함께 확인했습니다.",
              partNumber: "Dreame Ultra 3.2L 호환",
              packageLabel: "판매 페이지에서 수량 확인",
            }
          : undefined,
      secondarySources:
        id === "dreame-x40s-dust-bag"
          ? [
              {
                title: "Dreame Ultra 3.2L 먼지봉투 호환표 — X40 Ultra·X40s Pro Ultra",
                url: "https://www.provysavace.cz/m-25829-dreame-x40-pro-ultra-sacky-pro-roboticky-vysavac-dreame-x50-ultra-l40-ultra-5-ks-x19426",
                sourceType: "seller",
              },
            ]
          : [],
      purchaseUnavailable: id !== "dreame-x40s-dust-bag",
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
      compatibleProductName: displayName.replace("드리미 ", ""),
      modelIds: ["dreame-l10s-pro-ultra-heat"],
      sourceTitle: "드리미 공식 L10s Pro Ultra Heat 제품 구성",
      sourceUrl: "https://global.dreametech.com/products/l10s-pro-ultra",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-09-13",
      directUrl: "https://link.coupang.com/a/g0C5rFSf6W",
      affiliateProductOption: {
        name: `${displayName.replace("드리미 ", "")} 호환상품`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 L10s Pro Ultra Heat 적용을 표기한 옵션형 호환상품입니다. 현재 소모품 종류와 수량을 옵션에서 확인하세요.",
        partNumber: "L10s Pro Ultra Heat 호환",
        packageLabel: "선택 옵션의 구성 확인 필요",
      },
    }),
  ),
];
