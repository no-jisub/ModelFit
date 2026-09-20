import {
  affiliate,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const narwalConsumableRecords: ConsumableRecord[] = [
  {
    id: "narwal-freo-mop-pad",
    slug: "narwal-freo-mop-pad",
    type: "mop-pad",
    displayName: "Narwal Freo 시리즈 물걸레 패드",
    compatibleProductName: "Narwal Mop Pad for Freo 시리즈",
    compatibleModelIds: [
      "narwal-freo-z10",
      "narwal-freo-z-ultra",
      "narwal-freo-x-ultra",
      "narwal-freo",
    ],
    searchKeywords: ["Narwal Freo Mop Pad", "나르왈 Freo 물걸레 패드"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Narwal 공식몰 — Freo Z10·Z Ultra·X Ultra·Freo 호환 물걸레 패드",
        "https://us.narwal.com/products/mop-pad-for-freo-x-ultra",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      "나르왈 Freo 정품 물걸레 패드",
      "https://link.coupang.com/a/haVdVVPFJc",
      "2026-09-19",
      undefined,
      {
        name: "나르왈 Freo X Plus 정품 물걸레",
        kind: "genuine",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Narwal Freo X Plus 전용 정품 물걸레로 표기한 상품입니다. 다른 Freo 모델은 호환 여부를 구매 전에 확인하세요.",
        partNumber: "Freo X Plus 전용",
        packageLabel: "물걸레 2개",
      },
    ),
  },
  {
    id: "narwal-freo-zero-tangle-roller",
    slug: "narwal-freo-zero-tangle-roller",
    type: "main-brush",
    displayName: "Narwal Freo 제로 탱글 롤러 브러시",
    compatibleProductName: "Zero-Tangling Silent Roller Brush · 1개",
    compatibleModelIds: ["narwal-freo-z10", "narwal-freo-z-ultra", "narwal-freo-x-ultra"],
    searchKeywords: ["Narwal Zero-Tangling Roller Brush", "나르왈 Freo 롤러 브러시"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Narwal 공식몰 — Freo Z10·Z Ultra·X Ultra 호환 제로 탱글 롤러",
        "https://us.narwal.com/products/zero-tangling-silent-roller-brush-for-freo-x-ultra",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      "나르왈 Freo 정품 제로 탱글 롤러 브러시",
      "https://link.coupang.com/a/g0DbewD9UW",
      "2026-09-13",
      undefined,
      {
        name: "Narwal Freo 제로 탱글 롤러 브러시",
        kind: "genuine",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Narwal Freo 시리즈용 제품으로 표기한 상품입니다. 적용 모델과 판매자를 구매 전에 확인하세요.",
        packageLabel: "롤러 브러시 1개",
      },
    ),
  },
  {
    id: "narwal-freo-dustbin-filter",
    slug: "narwal-freo-dustbin-filter",
    type: "dust-bin-filter",
    displayName: "Narwal Freo 먼지통 필터",
    compatibleProductName: "Dust Bin Filter · 2개입",
    compatibleModelIds: ["narwal-freo-z10", "narwal-freo-z-ultra", "narwal-freo-x-ultra"],
    searchKeywords: ["Narwal Freo Dust Bin Filter", "나르왈 Freo 먼지통 필터"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Narwal 공식몰 — Flow·Freo Z10·Z Ultra·X Ultra 호환 먼지통 필터 2개입",
        "https://us.narwal.com/products/dust-bin-filter-for-freo-x-ultra",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      "나르왈 Freo 정품 먼지통 필터 2개입",
      "https://link.coupang.com/a/g0DdMBYvLw",
      "2026-09-13",
      undefined,
      {
        name: "Narwal Freo 시리즈 먼지통 필터",
        kind: "genuine",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Narwal Freo 시리즈용 제품으로 표기한 상품입니다. 적용 모델과 판매자를 구매 전에 확인하세요.",
        packageLabel: "먼지통 필터 2개",
      },
    ),
  },
  {
    id: "narwal-freo-side-brush",
    slug: "narwal-freo-side-brush",
    type: "side-brush",
    displayName: "Narwal Freo 사이드 브러시",
    compatibleProductName: "Side Brush · 2개입",
    compatibleModelIds: ["narwal-freo-z-ultra", "narwal-freo-x-ultra", "narwal-freo"],
    searchKeywords: ["Narwal Freo Side Brush", "나르왈 Freo 사이드 브러시"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Narwal 공식 Freo 액세서리 호환표 — Z Ultra·X Ultra·Freo 사이드 브러시 2개입",
        "https://us.narwal.com/pages/freo-product",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      "나르왈 Freo 정품 사이드 브러시 2개입",
      "https://link.coupang.com/a/g1V9t4fNN6",
      "2026-09-14",
      undefined,
      {
        name: "Freo X Ultra·X Plus·Z Ultra·Freo Pro 사이드 브러시",
        kind: "genuine",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Narwal Freo X Ultra·X Plus·Z Ultra·Freo Pro용 사이드 브러시로 표기한 상품입니다. 사용하는 모델을 구매 전에 확인하세요.",
        packageLabel: "사이드 브러시 2종 세트",
      },
    ),
  },
  {
    id: "narwal-freo-dust-bag",
    slug: "narwal-freo-dust-bag",
    type: "dust-bag",
    displayName: "Narwal Freo Z Ultra·Z10 베이스 스테이션 먼지봉투",
    compatibleProductName: "Base Station Dust Bag · 2개입",
    compatibleModelIds: ["narwal-freo-z10", "narwal-freo-z-ultra"],
    searchKeywords: ["Narwal Freo Z10 Z Ultra Base Station Dust Bag"],
    replacementInterval: "최대 120일 (사용량과 봉투 상태에 따라 달라짐)",
    purchaseWarning: `${regionalWarning} Freo X Ultra용 3개입 먼지봉투와 호환 구성이 다르므로 혼용하지 마세요.`,
    verificationStatus: "official",
    sources: [
      source(
        "Narwal 공식몰 — Freo Z Ultra·Z10 베이스 스테이션 먼지봉투 2개입",
        "https://us.narwal.com/products/base-station-dust-bag-for-freo-z-ultra",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      "나르왈 Freo Z10 Z Ultra 정품 먼지봉투 2개입",
      "https://link.coupang.com/a/haKVvc2Ztk",
      "2026-09-19",
      undefined,
      {
        name: "Freo Z Ultra·Z10·Flow 호환 먼지봉투",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Narwal Freo Z Ultra·Z10·Flow 호환 먼지봉투로 표기한 상품입니다. 적용 모델과 구성 수량을 구매 전에 확인하세요.",
        packageLabel: "판매 페이지 옵션 확인",
      },
    ),
  },
  researchedPart({
    id: "narwal-freo-z10-side-brush",
    type: "side-brush",
    displayName: "나르왈 Freo Z10 자동 엉킴 방지 사이드 브러시",
    compatibleProductName: "Auto Detangling Side Brush",
    modelIds: ["narwal-freo-z10"],
    sourceTitle: "Narwal 공식몰 — Freo Z10 자동 엉킴 방지 사이드 브러시",
    sourceUrl: "https://us.narwal.com/products/auto-detangling-side-brush-for-freo-pro",
    sourceType: "official-store",
    searchKeyword: "나르왈 Freo Z10 정품 자동 엉킴 방지 사이드 브러시",
    replacementInterval: "3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
    regional: true,
    verifiedAt: "2026-09-13",
    directUrl: "https://link.coupang.com/a/g0DePzFBV6",
    affiliateProductOption: {
      name: "Freo Z10·Z10 Ultra 사이드 브러시 2종 세트",
      kind: "genuine",
      verification: "seller-claimed",
      description:
        "판매 페이지가 Narwal Freo Z10·Z10 Ultra용 사이드 브러시 세트로 표기한 상품입니다. 사용하는 모델의 브러시를 확인하세요.",
      partNumber: "Freo Z10 계열",
      packageLabel: "사이드 브러시 2종 세트",
    },
  }),
  researchedPart({
    id: "narwal-freo-x-ultra-dust-bag",
    type: "dust-bag",
    displayName: "나르왈 Freo X Ultra 일회용 먼지봉투",
    compatibleProductName: "Disposable Dust Bag · 3개입",
    modelIds: ["narwal-freo-x-ultra"],
    sourceTitle: "Narwal 공식몰 — Freo X Ultra 전용 일회용 먼지봉투 3개입",
    sourceUrl: "https://us.narwal.com/products/3pcs-disposable-dust-bag-for-freo-x-ultra",
    sourceType: "official-store",
    searchKeyword: "나르왈 Freo X Ultra 정품 먼지봉투 3개입",
    regional: true,
    verifiedAt: "2026-09-19",
    directUrl: "https://link.coupang.com/a/haKUnwN9Lp",
    affiliateProductOption: {
      name: "Freo X Ultra·Pro·Z10 호환 먼지봉투 3개",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 Narwal Freo X Ultra·Pro·Z10 적용을 표기한 타사 먼지봉투입니다. Freo X Ultra용 3개 구성을 선택했는지 구매 전에 확인하세요.",
      partNumber: "Freo X Ultra 호환",
      packageLabel: "먼지봉투 3개",
    },
  }),
  ...(
    [
      [
        "narwal-flow-dustbin-filter",
        "dust-bin-filter",
        "나르왈 Flow 먼지통 필터",
        "Dust Bin HEPA Filter · 2개",
        "3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      ],
      [
        "narwal-flow-main-brush",
        "main-brush",
        "나르왈 Flow 제로탱글 플로팅 브러시",
        "Zero-Tangling Roller Brush · 1개",
        "6개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      ],
      [
        "narwal-flow-side-brush",
        "side-brush",
        "나르왈 Flow 안티탱글 사이드 브러시",
        "Detangling Side Brush · 2개",
        "3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      ],
      [
        "narwal-flow-track-mop",
        "mop-pad",
        "나르왈 Flow 크롤러 물걸레",
        "Track Mop · 2개",
        "1~3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      ],
      [
        "narwal-flow-dust-bag",
        "dust-bag",
        "나르왈 Flow 베이스 스테이션 먼지봉투",
        "Base Station Dust Bag · 3개",
        "최대 120일 (사용량과 봉투 상태에 따라 달라짐)",
      ],
    ] as const
  ).map(([id, type, displayName, compatibleProductName, replacementInterval]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName: `Flow Accessories Set · ${compatibleProductName}`,
      modelIds: ["narwal-flow"],
      sourceTitle: "Narwal 공식 Flow 액세서리 세트 — 구성 수량",
      sourceUrl: "https://jp.narwal.com/products/narwal-flow-accessories-set",
      sourceType: "official-store",
      searchKeyword: `${displayName} 정품`,
      replacementInterval,
      regional: true,
      verifiedAt: "2026-09-19",
      secondarySources: [
        {
          title: "Narwal 공식 Flow Advanced Kit — 호환 모델과 구성 수량",
          url: "https://us.narwal.com/products/advanced-kit-for-flow",
          sourceType: "official-store",
        },
      ],
      directUrl:
        id === "narwal-flow-dust-bag"
          ? "https://link.coupang.com/a/haCchXcp6y"
          : "https://link.coupang.com/a/haCaIweZ2H",
      affiliateProductOption: {
        name: `Narwal Flow ${compatibleProductName} 호환 옵션`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 Narwal Flow용 메인 롤러·사이드 브러시·먼지봉투·필터·물걸레 옵션을 제공하는 호환상품입니다. 사용하는 부품 종류와 구성 수량을 구매 전에 확인하세요.",
        packageLabel:
          id === "narwal-flow-dust-bag" ? "먼지봉투 옵션 확인" : "선택 옵션의 구성 확인 필요",
      },
    }),
  ),
];
