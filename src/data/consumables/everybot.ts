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
    displayName: "에브리봇 엣지2 RS350 극세사 걸레 2장",
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
    affiliate: affiliate("에브리봇 RS350 정품 극세사 걸레"),
  },
  {
    id: "everybot-rs350-yarn-mop",
    slug: "everybot-rs350-yarn-mop",
    type: "mop-pad",
    displayName: "에브리봇 엣지2 RS350 분섬사 걸레 2장",
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
    affiliate: affiliate("에브리봇 RS350 정품 분섬사 걸레"),
  },
  ...(
    [
      ["everybot-q11-filter", "dust-bin-filter", "에브리봇 Q11 HEPA 필터"],
      ["everybot-q11-main-brush", "main-brush", "에브리봇 Q11 메인 브러시"],
      ["everybot-q11-side-brush", "side-brush", "에브리봇 Q11 사이드 브러시"],
      ["everybot-q11-mop-pad", "mop-pad", "에브리봇 Q11 전용 걸레"],
      ["everybot-q11-dust-bag", "dust-bag", "에브리봇 Q11 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["everybot-q11"],
      sourceTitle: "에브리봇 공식몰 — Q11 정품 추가 구성품",
      sourceUrl: "https://everybotmall.com/product/%241/295/",
      searchKeyword: `${displayName} 정품`,
    }),
  ),
  ...(
    [
      ["everybot-q9-filter", "dust-bin-filter", "에브리봇 Q9 HEPA 필터"],
      ["everybot-q9-main-brush", "main-brush", "에브리봇 Q9 메인 브러시"],
      ["everybot-q9-side-brush", "side-brush", "에브리봇 Q9 사이드 브러시"],
      ["everybot-q9-mop-pad", "mop-pad", "에브리봇 Q9 전용 걸레"],
      ["everybot-q9-dust-bag", "dust-bag", "에브리봇 Q9 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["everybot-q9"],
      sourceTitle: "에브리봇 공식몰 — Q9 정품 추가 구성품",
      sourceUrl:
        "https://everybotmall.com/product/%EA%B0%95%EC%84%B8%EC%9D%BC-%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-ai-%EC%98%AC%EC%9D%B8%EC%9B%90-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-q9/231",
      searchKeyword: `${displayName} 정품`,
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
      verifiedAt: "2026-08-07",
    }),
  ),
  researchedPart({
    id: "everybot-three-spin-microfiber-mop",
    type: "mop-pad",
    displayName: "에브리봇 쓰리스핀 극세사 걸레 3장",
    compatibleProductName: "에브리봇 물걸레 로봇청소기 극세사걸레(3장)",
    modelIds: ["everybot-ts402m"],
    sourceTitle: "에브리봇 공식몰 — 쓰리스핀용 극세사 걸레 3장",
    sourceUrl:
      "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%AC%BC%EA%B1%B8%EB%A0%88-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EA%B7%B9%EC%84%B8%EC%82%AC%EA%B1%B8%EB%A0%883%EC%9E%A5/219/",
    searchKeyword: "에브리봇 쓰리스핀 EVO 극세사 걸레 3장 정품",
    verifiedAt: "2026-08-03",
  }),
  researchedPart({
    id: "everybot-three-spin-yarn-mop",
    type: "mop-pad",
    displayName: "에브리봇 쓰리스핀 분섬사 걸레 3장",
    compatibleProductName: "에브리봇 물걸레 로봇청소기 분섬사걸레(3장)",
    modelIds: ["everybot-ts402m"],
    sourceTitle: "에브리봇 공식몰 — 쓰리스핀용 분섬사 걸레 3장",
    sourceUrl:
      "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%AC%BC%EA%B1%B8%EB%A0%88-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EB%B6%84%EC%84%AC%EC%82%AC%EA%B1%B8%EB%A0%883%EC%9E%A5/209/",
    searchKeyword: "에브리봇 쓰리스핀 EVO 분섬사 걸레 3장 정품",
    verifiedAt: "2026-08-03",
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
    verifiedAt: "2026-08-03",
  }),
];
