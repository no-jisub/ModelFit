import {
  affiliate,
  domesticWarning,
  source,
  unavailableAffiliate,
  type ConsumableRecord,
} from "./shared";

export const dysonConsumableRecords: ConsumableRecord[] = [
  {
    id: "dyson-bp04-k-carbon-filter",
    slug: "dyson-bp04-k-carbon-filter",
    type: "deodorizing-filter",
    displayName: "다이슨 BP04 K-카본 필터",
    compatibleProductName: "K-Carbon filter",
    compatibleModelIds: ["dyson-bp04"],
    searchKeywords: ["다이슨 BP04 K 카본 필터", "Dyson BP04 K-Carbon filter"],
    purchaseWarning: `${domesticWarning} K-카본 필터와 HEPA H13 필터는 서로 다른 교체 부품입니다. 두 필터의 포함 여부를 각각 확인하세요.`,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — BP04 K-카본 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/bp04",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(
      "다이슨 BP04 정품 K 카본 필터",
      "https://link.coupang.com/a/haDNWmnGdU",
      "2026-09-19",
      undefined,
      {
        name: "BP02·BP03·BP04 호환 활성탄소 필터",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 BP04 적용을 표기한 타사 활성탄소 필터입니다. 다이슨 정품 K-카본 필터가 아니므로 규격과 적용 모델을 구매 전에 확인하세요.",
        partNumber: "BP02·BP03·BP04 호환",
        packageLabel: "판매 페이지에서 구성 확인",
      },
    ),
  },
  {
    id: "dyson-big-quiet-hepa-h13-filter",
    slug: "dyson-big-quiet-hepa-h13-filter",
    type: "hepa-filter",
    displayName: "다이슨 빅+콰이엇 HEPA H13 필터",
    compatibleProductName: "HEPA H13 filter",
    compatibleModelIds: ["dyson-bp03", "dyson-bp04"],
    searchKeywords: ["다이슨 BP03 BP04 HEPA H13 필터", "Dyson Big Quiet HEPA H13"],
    replacementInterval: "최대 5년 (하루 12시간 사용 기준이며 사용 환경에 따라 달라짐)",
    purchaseWarning: `${domesticWarning} HEPA H13 필터는 BP03의 활성 탄소 필터 및 BP04의 K-카본 필터와 별도 부품입니다.`,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — BP03·BP04 HEPA H13 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/bp04",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(
      "다이슨 BP03 BP04 정품 HEPA H13 필터",
      "https://link.coupang.com/a/g0CDpsrYjs",
      "2026-09-13",
      undefined,
      {
        name: "BP03·BP04 호환 HEPA H13 필터",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 BP03·BP04 적용을 표기한 타사 HEPA H13 필터입니다. 다이슨 정품이 아닙니다.",
        partNumber: "BP03·BP04 호환",
        packageLabel: "선택 옵션의 구성 확인 필요",
      },
    ),
  },
  {
    id: "dyson-bp03-activated-carbon-filter",
    slug: "dyson-bp03-activated-carbon-filter",
    type: "deodorizing-filter",
    displayName: "다이슨 BP03 활성 탄소 필터",
    compatibleProductName: "Activated carbon filter",
    compatibleModelIds: ["dyson-bp03"],
    searchKeywords: ["다이슨 BP03 활성 탄소 필터", "Dyson BP03 activated carbon filter"],
    purchaseWarning: `${domesticWarning} 활성 탄소 필터와 HEPA H13 필터는 서로 다른 교체 부품입니다. 두 필터의 포함 여부를 각각 확인하세요.`,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — BP03 활성 탄소 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/bp03",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(
      "다이슨 BP03 정품 활성 탄소 필터",
      "https://link.coupang.com/a/haDNWmnGdU",
      "2026-09-19",
      undefined,
      {
        name: "BP02·BP03·BP04 호환 활성탄소 필터",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 BP03 적용을 표기한 타사 활성탄소 필터입니다. 다이슨 정품이 아니므로 규격과 적용 모델을 구매 전에 확인하세요.",
        partNumber: "BP02·BP03·BP04 호환",
        packageLabel: "판매 페이지에서 구성 확인",
      },
    ),
  },
  {
    id: "dyson-360-glass-hepa-carbon-filter",
    slug: "dyson-360-glass-hepa-carbon-filter",
    type: "all-in-one-filter",
    displayName: "다이슨 360° 글라스 HEPA+탄소 필터",
    compatibleProductName: "360° Glass HEPA+Carbon filter",
    compatibleModelIds: ["dyson-hp09", "dyson-tp09", "dyson-ph04"],
    searchKeywords: ["다이슨 HP09 TP09 PH04 360 글라스 HEPA 탄소 필터"],
    purchaseWarning: `${domesticWarning} 이 제품은 HEPA와 탄소 기능이 결합된 단일 교체 필터입니다.`,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — HP09·TP09·PH04 호환 360° 글라스 HEPA+탄소 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/tp04",
        "manufacturer",
      ),
    ],
    affiliate: unavailableAffiliate("다이슨 HP09 TP09 PH04 정품 필터"),
  },
];
