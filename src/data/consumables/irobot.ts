import {
  affiliate,
  coupangSearch,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const irobotConsumableRecords: ConsumableRecord[] = [
  {
    id: "irobot-combo-j-high-efficiency-filter",
    slug: "irobot-combo-j-high-efficiency-filter-4785883",
    type: "dust-bin-filter",
    displayName: "iRobot Roomba Combo j 시리즈 고효율 필터",
    genuinePartNumber: "4785883",
    compatibleProductName: "High-Efficiency Filter, 3-Pack for Roomba Combo j Series",
    compatibleModelIds: ["irobot-combo-10-max", "irobot-combo-j9-plus"],
    searchKeywords: ["iRobot 4785883", "Roomba Combo 10 Max j9+ Filter"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "iRobot 공식몰 — Combo 10 Max·j9+ 고효율 필터 Item #4785883",
        "https://www.irobot.com/en_US/high-efficiency-filter%252c-3-pack-for-roomba-combo-j-series/4785883.html",
      ),
    ],
    affiliate: affiliate("아이로봇 4785883 정품 필터", coupangSearch("iRobot 정품 4785883 필터")),
  },
  {
    id: "irobot-i-e-j-high-efficiency-filter",
    slug: "irobot-i-e-j-high-efficiency-filter-4639161",
    type: "dust-bin-filter",
    displayName: "iRobot Roomba Combo i·e·j 시리즈 고효율 필터",
    genuinePartNumber: "4639161",
    compatibleProductName: "High-Efficiency Filter, 3-Pack",
    compatibleModelIds: ["irobot-combo-i5"],
    searchKeywords: ["iRobot 4639161", "Roomba Combo i5 Filter"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "iRobot 공식몰 — Combo i5 호환 고효율 필터 Item #4639161",
        "https://www.irobot.com/en_US/high-efficiency-filter%252c-3-pack-for-roomba-combo-and-roomba-i%252c-e%252c-and-j-series/4639161.html?cgid=us",
      ),
    ],
    affiliate: affiliate("아이로봇 4639161 정품 필터", coupangSearch("iRobot 정품 4639161 필터")),
  },
  {
    id: "irobot-105-filter",
    slug: "irobot-105-filter-4837321",
    type: "dust-bin-filter",
    displayName: "iRobot Roomba 105 필터",
    genuinePartNumber: "4837321",
    compatibleProductName: "Filter, 3-Pack",
    compatibleModelIds: ["irobot-105-vac"],
    searchKeywords: ["iRobot 4837321", "Roomba 105 Vac Filter"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "iRobot 공식몰 — Roomba 105 호환 필터 Item #4837321",
        "https://www.irobot.com/en_US/filter-3-pack/4837321.html",
      ),
    ],
    affiliate: affiliate("아이로봇 4837321 정품 필터", coupangSearch("iRobot 정품 4837321 필터")),
  },
  ...(
    [
      ["irobot-205-filter", "dust-bin-filter", "아이로봇 Roomba 205 DustCompactor 필터"],
      ["irobot-205-main-brush", "main-brush", "아이로봇 Roomba 205 멀티서피스 러버 브러시"],
      ["irobot-205-side-brush", "side-brush", "아이로봇 Roomba 205 엣지 스위핑 브러시"],
      ["irobot-205-mop-pad", "mop-pad", "아이로봇 Roomba 205 세척형 물걸레 패드"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["irobot-205-dustcompactor"],
      sourceTitle: "iRobot 공식 Roomba 200 DustCompactor 액세서리 목록",
      sourceUrl:
        "https://www.irobot.com/en_US/us/robot-vacuum-plus-mop-accessories/roomba-205-dustcompactor-combo",
      sourceType: "official-store",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
  researchedPart({
    id: "irobot-clean-base-autowash-dust-bag",
    type: "dust-bag",
    displayName: "iRobot Clean Base·AutoWash 먼지봉투",
    compatibleProductName: "Replacement Dirt Disposal Bags, 3-Pack",
    genuinePartNumber: "4640235",
    modelIds: ["irobot-combo-10-max", "irobot-combo-j9-plus"],
    sourceTitle: "iRobot 공식몰 — Clean Base·AutoWash 교체용 먼지봉투 Item #4640235",
    sourceUrl:
      "https://www.irobot.com/en_US/replacement-dirt-disposal-bags%252c-3-pack/4640235.html",
    searchKeyword: "iRobot 4640235 정품 먼지봉투",
    regional: true,
    verifiedAt: "2026-08-04",
    secondarySources: [
      {
        title: "iRobot 공식 Combo 10 Max 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/roomba-combo-10-max-2",
      },
      {
        title: "iRobot 공식 Combo j9 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/roomba-combo-j9plus",
      },
    ],
  }),
  researchedPart({
    id: "irobot-combo-i-e-j-dual-rubber-brushes",
    type: "main-brush",
    displayName: "iRobot Combo·i·e·j 시리즈 듀얼 고무 브러시",
    compatibleProductName: "Dual Multi-Surface Rubber Brushes",
    genuinePartNumber: "4639309",
    modelIds: ["irobot-combo-10-max", "irobot-combo-j9-plus", "irobot-combo-i5"],
    sourceTitle: "iRobot 공식몰 — 듀얼 멀티 서피스 고무 브러시 Item #4639309",
    sourceUrl:
      "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-combo-and-roomba-e%2C-i%2C-and-j-series-and-roomba-combo-10-max/4639309.html",
    searchKeyword: "iRobot 4639309 정품 듀얼 고무 브러시",
    regional: true,
    verifiedAt: "2026-08-04",
    secondarySources: [
      {
        title: "iRobot 공식 Combo 10 Max 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/roomba-combo-10-max-2",
      },
      {
        title: "iRobot 공식 Combo j9 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/roomba-combo-j9plus",
      },
      {
        title: "iRobot 공식 Combo i5 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/us/robot-vacuum-plus-mop-accessories/roomba-combo-i5-series",
      },
    ],
  }),
  researchedPart({
    id: "irobot-combo-i-e-j-edge-brush",
    type: "side-brush",
    displayName: "iRobot Combo·i·e·j 시리즈 엣지 브러시",
    compatibleProductName: "Edge-Sweeping Brush 3 Pack",
    genuinePartNumber: "4757625",
    modelIds: ["irobot-combo-10-max", "irobot-combo-j9-plus", "irobot-combo-i5"],
    sourceTitle: "iRobot 공식몰 — 엣지 스위핑 브러시 Item #4757625",
    sourceUrl:
      "https://www.irobot.com/en_US/edge-sweeping-brush-3-pack-for-roomba-combo-and-roomba-i%2C-e-and-j-series-and-roomba-combo-10-max/4757625.html",
    searchKeyword: "iRobot 4757625 정품 엣지 브러시",
    regional: true,
    verifiedAt: "2026-08-04",
    secondarySources: [
      {
        title: "iRobot 공식 Combo 10 Max 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/roomba-combo-10-max-2",
      },
      {
        title: "iRobot 공식 Combo j9 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/roomba-combo-j9plus",
      },
      {
        title: "iRobot 공식 Combo i5 시리즈 액세서리 호환표",
        url: "https://www.irobot.com/en_US/us/robot-vacuum-plus-mop-accessories/roomba-combo-i5-series",
      },
    ],
  }),
  researchedPart({
    id: "irobot-combo-j9-washable-mop-pad",
    type: "mop-pad",
    displayName: "iRobot Roomba Combo j9+ 세척형 물걸레 패드",
    compatibleProductName: "Washable Cleaning Pad, 2-Pack",
    modelIds: ["irobot-combo-j9-plus"],
    sourceTitle: "iRobot 공식 Combo j9 시리즈 — 세척형 클리닝 패드",
    sourceUrl: "https://www.irobot.com/en_US/roomba-combo-j9plus",
    searchKeyword: "iRobot Roomba Combo j9+ 정품 물걸레 패드",
    regional: true,
    verifiedAt: "2026-08-04",
    secondarySources: [
      {
        title: "iRobot 공식 전체 액세서리 목록 — Combo j9+ 세척형 패드",
        url: "https://www.irobot.com/en_US/us/all-parts-and-accessories",
      },
    ],
  }),
  researchedPart({
    id: "irobot-combo-i5-mopping-kit",
    type: "mop-pad",
    displayName: "iRobot Roomba Combo i5 물걸레 보충 키트",
    compatibleProductName: "Roomba Combo j5 & i5 Mopping Replenishment Kit",
    modelIds: ["irobot-combo-i5"],
    sourceTitle: "iRobot 공식 Combo i5 시리즈 — 물걸레 보충 키트",
    sourceUrl:
      "https://www.irobot.com/en_US/us/robot-vacuum-plus-mop-accessories/roomba-combo-i5-series",
    searchKeyword: "iRobot Roomba Combo i5 정품 물걸레 키트",
    regional: true,
    verifiedAt: "2026-08-04",
    secondarySources: [
      {
        title: "iRobot 공식 전체 액세서리 목록 — Combo i5 보충 키트",
        url: "https://www.irobot.com/en_US/us/all-parts-and-accessories",
      },
    ],
  }),
];
