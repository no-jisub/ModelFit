import {
  affiliate,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const ecovacsConsumableRecords: ConsumableRecord[] = [
  ...(
    [
      ["ecovacs-n20-main-brush", "main-brush", "ECOVACS N20 메인 브러시", "Main Brush ×1"],
      ["ecovacs-n20-side-brush", "side-brush", "ECOVACS N20 사이드 브러시", "Side Brush ×4"],
      ["ecovacs-n20-filter", "dust-bin-filter", "ECOVACS N20 필터", "Filter ×3"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) => ({
    id,
    slug: id,
    type,
    displayName,
    compatibleProductName: `N20 Buddy Kit 포함 ${compatibleProductName}`,
    compatibleModelIds: ["ecovacs-deebot-n20-pro-plus"],
    searchKeywords: ["ECOVACS N20 PRO PLUS Buddy Kit", displayName],
    purchaseWarning: regionalWarning,
    verificationStatus: "official" as const,
    sources: [
      source(
        "ECOVACS 공식몰 — N20 PRO PLUS 호환 Buddy Kit 구성",
        "https://www.ecovacs.com/us/deebot-winbot-accessories/buddy-kit-n20",
      ),
    ],
    affiliate: affiliate(`에코백스 N20 PRO PLUS 정품 ${compatibleProductName}`),
  })),
  ...(
    [
      ["ecovacs-x12-filter", "dust-bin-filter", "에코백스 DEEBOT X12 필터"],
      ["ecovacs-x12-main-brush", "main-brush", "에코백스 DEEBOT X12 메인 브러시"],
      ["ecovacs-x12-side-brush", "side-brush", "에코백스 DEEBOT X12 사이드 브러시"],
      ["ecovacs-x12-roller-mop", "mop-pad", "에코백스 DEEBOT X12 OZMO 롤러 물걸레"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["ecovacs-deebot-x12"],
      sourceTitle: "에코백스 공식 DEEBOT X12 사용설명서 — 교체 부품과 주기",
      sourceUrl:
        "https://site-static.ecovacs.com/upload/file/support/2026/03/25/075626_7738%24DEEBOTX12FAMILYInstructionManualEU.pdf",
      sourceType: "official-manual",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
  ...(
    [
      ["ecovacs-x11-filter", "dust-bin-filter", "에코백스 DEEBOT X11 항균 필터"],
      ["ecovacs-x11-main-brush", "main-brush", "에코백스 DEEBOT X11 롤러 브러시"],
      ["ecovacs-x11-side-brush", "side-brush", "에코백스 DEEBOT X11 사이드 브러시"],
      ["ecovacs-x11-roller-mop", "mop-pad", "에코백스 DEEBOT X11 OZMO 롤러 물걸레"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["ecovacs-deebot-x11"],
      sourceTitle: "에코백스 코리아 공식 DEEBOT X11 제품 및 사용설명서",
      sourceUrl: "https://www.ecovacs.com/kr/deebot-robotic-vacuum-cleaner/deebot-x11-omnicyclone",
      sourceType: "official-manual",
      searchKeyword: `${displayName} 정품`,
    }),
  ),
  ...(
    [
      ["ecovacs-x9-t80-filter", "dust-bin-filter", "에코백스 X9·T80 항균 필터"],
      ["ecovacs-x9-t80-dust-bag", "dust-bag", "에코백스 X9·T80 항균 먼지봉투"],
      ["ecovacs-x9-t80-roller-mop", "mop-pad", "에코백스 X9·T80 항균 롤러 물걸레"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["ecovacs-deebot-x9", "ecovacs-deebot-t80"],
      sourceTitle: "에코백스 공식 X9·T80 액세서리 호환 목록",
      sourceUrl:
        "https://www.ecovacs.com/us/shop/deebot-robotic-vacuum-cleaner/bundle-deebot-t80-omni-accessories",
      sourceType: "official-store",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
  researchedPart({
    id: "ecovacs-t80-main-brush",
    type: "main-brush",
    displayName: "에코백스 DEEBOT T80 안티탱글 메인 브러시",
    modelIds: ["ecovacs-deebot-t80"],
    sourceTitle: "에코백스 공식 T80 액세서리 호환 목록",
    sourceUrl:
      "https://www.ecovacs.com/us/shop/deebot-robotic-vacuum-cleaner/bundle-deebot-t80-omni-accessories",
    searchKeyword: "에코백스 T80 정품 안티탱글 메인 브러시",
    regional: true,
  }),
];
