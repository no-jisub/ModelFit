import {
  affiliate,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const eufyConsumableRecords: ConsumableRecord[] = [
  {
    id: "eufy-c20-dust-bag",
    slug: "eufy-c20-dust-bag-t290a110",
    type: "dust-bag",
    displayName: "eufy Omni C20 먼지봉투",
    genuinePartNumber: "T290A110",
    compatibleProductName: "Large Capacity Dust Bags, 6-Pack",
    compatibleModelIds: ["eufy-omni-c20"],
    searchKeywords: ["eufy T290A110", "eufy Omni C20 Dust Bag"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식몰 — Omni C20 호환 먼지봉투 6개입",
        "https://www.eufy.com/products/t290a110",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate("eufy T290A110 Omni C20 정품 먼지봉투", undefined, "2026-09-10"),
  },
  ...(
    [
      [
        "eufy-c20-washable-filter",
        "dust-bin-filter",
        "eufy Omni C20 세척형 필터",
        "세척형 필터 2개",
      ],
      [
        "eufy-c20-roller-brush",
        "main-brush",
        "eufy Omni C20 롤러 브러시",
        "롤러 브러시 1개와 브러시 가드 1개",
      ],
      ["eufy-c20-side-brush", "side-brush", "eufy Omni C20 사이드 브러시", "사이드 브러시 2개"],
      ["eufy-c20-mop-cloth", "mop-pad", "eufy Omni C20 물걸레 패드", "물걸레 패드 2개"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) => ({
    id,
    slug: id,
    type,
    displayName,
    compatibleProductName: `C20 Replacement Kit 포함 ${compatibleProductName}`,
    compatibleModelIds: ["eufy-omni-c20"],
    searchKeywords: ["eufy Omni C20 Replacement Kit", displayName],
    purchaseWarning: regionalWarning,
    verificationStatus: "official" as const,
    sources: [
      source(
        "eufy 공식몰 — C20 Replacement Kit 구성",
        "https://www.eufy.com/products/t290c1f0",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(`${displayName} 정품`),
  })),
  {
    id: "eufy-x10-pro-side-brush",
    slug: "eufy-x10-pro-side-brush",
    type: "side-brush",
    displayName: "eufy X10 Pro Omni 사이드 브러시",
    compatibleProductName: "Replacement Side Brush, 2개",
    genuinePartNumber: "T29A1031",
    compatibleModelIds: ["eufy-x10-pro-omni"],
    searchKeywords: ["eufy X10 Pro Omni Side Brush", "유피 X10 Pro 사이드 브러시"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식몰 — X10 Pro Omni 사이드 브러시 2개",
        "https://www.eufy.com/products/t29a1031",
        "official-store",
        "2026-09-10",
      ),
      source(
        "eufy 공식 X10 Pro Omni 반년 구독 서비스 — 부품별 교체 주기",
        "https://www.eufy.com/products/bundle-t29a1031-1-t29e80w1-1-t29e90j1-3-t2351v11-81-1-t29e7031-4",
        "official-store",
        "2026-09-10",
      ),
    ],
    replacementInterval: "약 3개월 (공식 구독 서비스 권장)",
    affiliate: affiliate("eufy X10 Pro Omni 정품 사이드 브러시", undefined, "2026-09-10"),
  },
  {
    id: "eufy-c28-filter",
    slug: "eufy-c28-filter",
    type: "dust-bin-filter",
    displayName: "eufy Omni C28 필터",
    compatibleProductName: "C28 Replacement Kit 포함 교체 필터 2개",
    replacementInterval: "약 6개월 (공식 키트 권장, 사용 빈도에 따라 조정)",
    compatibleModelIds: ["eufy-omni-c28"],
    searchKeywords: ["eufy Omni C28 Filter", "유피 C28 필터"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식몰 — Omni C28 Replacement Kit 구성",
        "https://www.eufy.com/products/t291var0",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate("eufy Omni C28 정품 필터", undefined, "2026-09-10"),
  },
  {
    id: "eufy-c28-dust-bag",
    slug: "eufy-c28-dust-bag",
    type: "dust-bag",
    displayName: "eufy Omni C28 먼지봉투",
    compatibleProductName: "C28 Replacement Kit 포함 먼지봉투 3개",
    replacementInterval: "약 6개월 (공식 키트 권장, 사용 빈도에 따라 조정)",
    compatibleModelIds: ["eufy-omni-c28"],
    searchKeywords: ["eufy Omni C28 Dust Bag", "유피 C28 먼지봉투"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식몰 — Omni C28 Replacement Kit 구성",
        "https://www.eufy.com/products/t291var0",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate("eufy Omni C28 정품 먼지봉투", undefined, "2026-09-10"),
  },
  ...(
    [
      ["eufy-s2-filter", "dust-bin-filter", "eufy Omni S2 교체 필터", "교체 필터 세트 2개"],
      [
        "eufy-s2-main-brush",
        "main-brush",
        "eufy Omni S2 롤러 브러시",
        "롤러 브러시 1개와 브러시 가드 1개",
      ],
      ["eufy-s2-side-brush", "side-brush", "eufy Omni S2 사이드 브러시", "사이드 브러시 2쌍"],
      ["eufy-s2-roller-mop", "mop-pad", "eufy Omni S2 롤러 물걸레", "롤러 물걸레 1개"],
      ["eufy-s2-dust-bag", "dust-bag", "eufy Omni S2 먼지봉투", "먼지봉투 1개"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["eufy-omni-s2"],
      sourceTitle: "eufy 공식 Omni S2 액세서리 컬렉션",
      sourceUrl: "https://www.eufy.com/products/t291n110",
      searchKeyword: `${displayName} 정품`,
      replacementInterval: "약 6개월 (공식 키트 권장, 사용 빈도에 따라 조정)",
      regional: true,
      verifiedAt: "2026-09-11",
    }),
  ),
  ...(
    [
      ["eufy-s1-pro-filter", "dust-bin-filter", "eufy Omni S1 Pro 고성능 필터"],
      ["eufy-s1-pro-main-brush", "main-brush", "eufy Omni S1 Pro 롤링 브러시"],
      ["eufy-s1-pro-side-brush", "side-brush", "eufy Omni S1 Pro 사이드 브러시"],
      ["eufy-s1-pro-roller-mop", "mop-pad", "eufy Omni S1 Pro 롤링 물걸레"],
      ["eufy-s1-pro-dust-bag", "dust-bag", "eufy Omni S1 Pro 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["eufy-omni-s1-pro"],
      sourceTitle: "eufy 공식 S1 Pro 정품 액세서리 목록",
      sourceUrl: "https://www.eufy.com/collections/accessory-for-floor-washing-robot",
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-09-11",
    }),
  ),
  ...(
    [
      [
        "eufy-x10-pro-main-brush",
        "main-brush",
        "eufy X10 Pro Omni 롤러 브러시",
        "T29E90J1",
        "https://www.eufy.com/products/t29e90j1",
        "롤러 브러시 1개와 브러시 가드 1개",
        "약 6개월 (공식 구독 서비스 권장)",
      ],
      [
        "eufy-x10-pro-filter",
        "dust-bin-filter",
        "eufy X10 Pro Omni 세척형 필터",
        "T29E80W1",
        "https://www.eufy.com/products/t29e80w1",
        "세척형 필터 2개",
        "약 3개월 (공식 구독 서비스 권장)",
      ],
      [
        "eufy-x10-pro-mop-cloth",
        "mop-pad",
        "eufy X10 Pro Omni 세척형 물걸레 패드",
        "T29E7031",
        "https://www.eufy.com/us/products/t29e7031",
        "세척형 물걸레 패드 2개",
        "약 2개월 (공식 구독 서비스 권장)",
      ],
      [
        "eufy-x10-pro-dust-bag",
        "dust-bag",
        "eufy X10 Pro Omni 대용량 먼지봉투",
        "T29F70A2",
        "https://www.eufy.com/products/t29f70a2",
        "대용량 먼지봉투 6개입",
        "약 2개월 (공식 구독 서비스 권장)",
      ],
    ] as const
  ).map(
    ([
      id,
      type,
      displayName,
      genuinePartNumber,
      sourceUrl,
      compatibleProductName,
      replacementInterval,
    ]) =>
      researchedPart({
        id,
        type,
        displayName,
        genuinePartNumber,
        compatibleProductName,
        replacementInterval,
        modelIds: ["eufy-x10-pro-omni"],
        sourceTitle: `eufy 공식몰 — X10 Pro Omni 호환 ${displayName}`,
        sourceUrl,
        searchKeyword: `${displayName} 정품`,
        regional: true,
        verifiedAt: "2026-09-11",
        secondarySources: [
          {
            title: "eufy 공식 X10 Pro Omni 반년 구독 서비스 — 부품별 교체 주기",
            url: "https://www.eufy.com/products/bundle-t29a1031-1-t29e80w1-1-t29e90j1-3-t2351v11-81-1-t29e7031-4",
          },
        ],
      }),
  ),
  ...(
    [
      ["eufy-c28-side-brush", "side-brush", "eufy Omni C28 사이드 브러시", "사이드 브러시 2개"],
      [
        "eufy-c28-main-brush",
        "main-brush",
        "eufy Omni C28 롤러 브러시와 가드",
        "롤러 브러시와 브러시 가드 각 1개",
      ],
      ["eufy-c28-roller-mop", "mop-pad", "eufy Omni C28 롤러 물걸레", "롤러 물걸레 2개"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      replacementInterval: "약 6개월 (공식 키트 권장, 사용 빈도에 따라 조정)",
      modelIds: ["eufy-omni-c28"],
      sourceTitle: "eufy 공식몰 — Omni C28 교체 키트 구성과 호환 모델",
      sourceUrl: "https://www.eufy.com/products/t291var0",
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-09-11",
      secondarySources: [
        {
          title: "eufy 공식 Omni C28 제품 페이지 — DuoSpiral 브러시·롤러 물걸레",
          url: "https://www.eufy.com/products/t211a110",
          sourceType: "manufacturer",
        },
      ],
    }),
  ),
];
