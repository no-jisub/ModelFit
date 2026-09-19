import {
  affiliate,
  domesticWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const everybotConsumableRecords: ConsumableRecord[] = [
  {
    id: "everybot-rs350-microfiber-mop",
    slug: "everybot-rs350-microfiber-mop",
    type: "mop-pad",
    displayName: "에브리봇 엣지2 RS350 극세사 걸레",
    compatibleProductName: "극세사 걸레 2장",
    compatibleModelIds: ["everybot-rs350"],
    searchKeywords: ["에브리봇 RS350 극세사 걸레", "에브리봇 엣지2 걸레"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "에브리봇 공식몰 — 엣지2 RS350 전용 액세서리",
        "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EC%97%A3%EC%A7%802-%EB%AC%BC%EA%B1%B8%EB%A0%88%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-rs350/117/",
      ),
    ],
    affiliate: affiliate(
      "에브리봇 RS350 정품 극세사 걸레",
      "https://link.coupang.com/a/g0Dif3geGq",
      "2026-09-13",
      undefined,
      {
        name: "에브리봇 물걸레 로봇청소기 극세사 걸레",
        kind: "genuine",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에브리봇용 극세사 걸레로 표기한 상품입니다. RS350 적용 여부와 구성 수량을 구매 전에 확인하세요.",
        packageLabel: "판매 페이지에서 구성 수량 확인",
      },
    ),
  },
  {
    id: "everybot-rs350-yarn-mop",
    slug: "everybot-rs350-yarn-mop",
    type: "mop-pad",
    displayName: "에브리봇 엣지2 RS350 분섬사 걸레",
    compatibleProductName: "분섬사 걸레 2장",
    compatibleModelIds: ["everybot-rs350"],
    searchKeywords: ["에브리봇 RS350 분섬사 걸레", "에브리봇 엣지2 걸레"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "에브리봇 공식몰 — 엣지2 RS350 전용 액세서리",
        "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EC%97%A3%EC%A7%802-%EB%AC%BC%EA%B1%B8%EB%A0%88%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-rs350/117/",
      ),
    ],
    affiliate: affiliate(
      "에브리봇 RS350 정품 분섬사 걸레",
      "https://link.coupang.com/a/g0DjMeiXMi",
      "2026-09-13",
      undefined,
      {
        name: "에브리봇 분섬사 걸레",
        kind: "genuine",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에브리봇 분섬사 걸레로 표기한 상품입니다. RS350 적용 여부와 판매자를 구매 전에 확인하세요.",
        packageLabel: "분섬사 걸레 2개",
      },
    ),
  },
  ...(
    [
      [
        "everybot-q11-filter",
        "dust-bin-filter",
        "에브리봇 Q11 HEPA 필터",
        "HEPA필터 2개입",
        undefined,
      ],
      [
        "everybot-q11-main-brush",
        "main-brush",
        "에브리봇 Q11 메인 브러시",
        "메인브러시 1개",
        "https://link.coupang.com/a/haDL0OnD2G",
      ],
      [
        "everybot-q11-side-brush",
        "side-brush",
        "에브리봇 Q11 사이드 브러시",
        "사이드브러시 2개입",
        undefined,
      ],
      [
        "everybot-q11-mop-pad",
        "mop-pad",
        "에브리봇 Q11 전용 걸레",
        "전용 걸레 4매입",
        "https://link.coupang.com/a/haDNbQQo3g",
      ],
      ["everybot-q11-dust-bag", "dust-bag", "에브리봇 Q11 먼지봉투", "먼지봉투 3개입", undefined],
    ] as const
  ).map(([id, type, displayName, compatibleProductName, directUrl]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["everybot-q11"],
      sourceTitle: "에브리봇 공식몰 — Q11 정품 추가 구성품",
      sourceUrl: "https://everybotmall.com/category/q11/161/",
      searchKeyword: `${displayName} 정품`,
      directUrl,
      restrictionNote: directUrl?.includes("/vp/products/")
        ? "쿠팡 파트너스 링크 생성 제한 상품"
        : undefined,
      affiliateProductOption: directUrl
        ? {
            name:
              id === "everybot-q11-main-brush"
                ? "에브리봇 Q11 정품 메인 브러시"
                : "에브리봇 Q11 정품 전용 걸레 4매입",
            kind: "genuine",
            verification: "seller-claimed",
            description:
              id === "everybot-q11-main-brush"
                ? "판매 페이지가 에브리봇 Q11 정품 메인 브러시로 표기한 상품입니다. 판매자와 포장 표기를 구매 전에 확인하세요."
                : "판매 페이지가 에브리봇 Q11 정품 전용 걸레로 표기한 상품입니다. 판매자와 포장 표기를 구매 전에 확인하세요.",
            packageLabel: compatibleProductName,
          }
        : undefined,
      verifiedAt: directUrl ? "2026-09-19" : "2026-09-11",
    }),
  ),
  ...(
    [
      ["everybot-q9-filter", "dust-bin-filter", "에브리봇 Q9 HEPA 필터", "HEPA필터 2개입"],
      ["everybot-q9-main-brush", "main-brush", "에브리봇 Q9 메인 브러시", "메인브러시 1개"],
      ["everybot-q9-side-brush", "side-brush", "에브리봇 Q9 사이드 브러시", "사이드브러시 2개입"],
      ["everybot-q9-mop-pad", "mop-pad", "에브리봇 Q9 전용 걸레", "전용 걸레 2세트(4매입)"],
      ["everybot-q9-dust-bag", "dust-bag", "에브리봇 Q9 먼지봉투", "먼지봉투 3개입"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["everybot-q9"],
      sourceTitle: "에브리봇 공식몰 — Q9 정품 추가 구성품",
      sourceUrl: "https://everybotmall.com/category/q9/135/",
      searchKeyword: `${displayName} 정품`,
      directUrl: "https://www.coupang.com/vp/products/9424115133",
      restrictionNote: "쿠팡 파트너스 링크 생성 제한 상품",
      affiliateProductOption: {
        name: `Q9 ${compatibleProductName} 호환 옵션`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에브리봇 Q9용 소모품 옵션으로 표기한 상품입니다. 파트너스 링크 생성이 제한되어 일반 상품 링크로 제공합니다.",
        packageLabel: compatibleProductName,
      },
      verifiedAt: "2026-09-14",
    }),
  ),
  ...(
    [
      ["everybot-q3-filter", "dust-bin-filter", "에브리봇 Q3·Q3 Plus 스폰지+HEPA 필터"],
      ["everybot-q3-main-brush", "main-brush", "에브리봇 Q3·Q3 Plus 메인 브러시"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["everybot-q3-turbo-plus"],
      sourceTitle: "에브리봇 공식몰 — Q3·Q3 Plus 정품 액세서리",
      sourceUrl: "https://everybotmall.com/category/q3-q3q3-plus/139/",
      searchKeyword: `${displayName} 정품`,
      directUrl:
        id === "everybot-q3-filter"
          ? "https://link.coupang.com/a/haCgZofElg"
          : "https://link.coupang.com/a/haCi8FmLIG",
      affiliateProductOption: {
        name:
          id === "everybot-q3-filter"
            ? "에브리봇 Q3·Q3 Plus 호환 필터 옵션"
            : "에브리봇 Q3·Q3 Plus 호환 메인 브러시 옵션",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에브리봇 Q3·Q3 Plus용 소모품 옵션으로 표기한 호환상품입니다. 선택한 부품 종류와 구성 수량을 구매 전에 확인하세요.",
        packageLabel: id === "everybot-q3-filter" ? "필터 옵션 선택" : "메인 브러시 옵션 선택",
      },
      verifiedAt: "2026-09-19",
    }),
  ),
  researchedPart({
    id: "everybot-three-spin-microfiber-mop",
    type: "mop-pad",
    displayName: "에브리봇 쓰리스핀 극세사 걸레",
    compatibleProductName: "에브리봇 물걸레 로봇청소기 극세사걸레(3장)",
    modelIds: ["everybot-ts402m"],
    sourceTitle: "에브리봇 공식몰 — 쓰리스핀용 극세사 걸레 3장",
    sourceUrl:
      "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%AC%BC%EA%B1%B8%EB%A0%88-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EA%B7%B9%EC%84%B8%EC%82%AC%EA%B1%B8%EB%A0%883%EC%9E%A5/219/",
    searchKeyword: "에브리봇 쓰리스핀 EVO 극세사 걸레 3장 정품",
    directUrl: "https://link.coupang.com/a/g1XbQZPfZQ",
    affiliateProductOption: {
      name: "에브리봇 쓰리스핀 호환 물걸레 패드",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 에브리봇 엣지·쓰리스핀 계열 호환 물걸레 패드로 표기한 상품입니다. 사용하는 모델과 재질을 구매 전에 확인하세요.",
      packageLabel: "호환 물걸레 패드 · 판매 페이지 구성 확인",
    },
    verifiedAt: "2026-09-14",
  }),
  researchedPart({
    id: "everybot-three-spin-yarn-mop",
    type: "mop-pad",
    displayName: "에브리봇 쓰리스핀 분섬사 걸레",
    compatibleProductName: "에브리봇 물걸레 로봇청소기 분섬사걸레(3장)",
    modelIds: ["everybot-ts402m"],
    sourceTitle: "에브리봇 공식몰 — 쓰리스핀용 분섬사 걸레 3장",
    sourceUrl:
      "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%AC%BC%EA%B1%B8%EB%A0%88-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EB%B6%84%EC%84%AC%EC%82%AC%EA%B1%B8%EB%A0%883%EC%9E%A5/209/",
    searchKeyword: "에브리봇 쓰리스핀 EVO 분섬사 걸레 3장 정품",
    verifiedAt: "2026-09-11",
  }),
  researchedPart({
    id: "everybot-three-spin-disposable-sheet",
    type: "mop-pad",
    displayName: "에브리봇 일회용 물걸레 청소포",
    compatibleProductName: "쓰리스핀용 중간패드에 부착하는 일회용 청소포",
    modelIds: ["everybot-ts402m"],
    sourceTitle: "에브리봇 공식몰 — 일회용 물걸레 청소포 30매",
    sourceUrl:
      "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%AC%BC%EA%B1%B8%EB%A0%88-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EC%9D%BC%ED%9A%8C%EC%9A%A9-%EC%B2%AD%EC%86%8C%ED%8F%AC30%EB%A7%A4/93/",
    searchKeyword: "에브리봇 쓰리스핀 EVO 일회용 청소포 30매 정품",
    verifiedAt: "2026-09-11",
  }),
];
