import type { ConsumableCompatibility, SourceReference } from "@/types";

const checkedAt = "2026-07-29";
const regionalWarning =
  "제조사 공식 자료로 호환 모델을 확인했습니다. 국가별 판매 구성이나 부품 사양이 다를 수 있으므로 구매 직전 제품 라벨의 모델명과 판매 페이지의 적용 모델을 다시 대조하세요. 쿠팡 상품명만으로 정품을 단정하지 말고 판매자와 제조사 표기도 확인하세요.";
const domesticWarning =
  "제조사 공식 자료로 호환 모델을 확인했습니다. 구매 직전 제품 라벨의 모델명과 부품번호 또는 공식 적용 모델을 다시 대조하세요. 쿠팡 상품명만으로 정품을 단정하지 말고 판매자와 제조사 표기도 확인하세요.";

const source = (
  title: string,
  url: string,
  sourceType: SourceReference["sourceType"] = "official-store",
  verifiedAt = checkedAt,
): SourceReference => ({ title, url, sourceType, checkedAt: verifiedAt });

const coupangSearch = (keyword: string) =>
  `https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`;

const affiliate = (searchKeyword: string, directUrl?: string, verifiedAt = checkedAt) => {
  const resolvedUrl = directUrl ?? coupangSearch(searchKeyword);

  return {
    searchKeyword,
    directUrl: resolvedUrl,
    enabled: true,
    status: resolvedUrl.includes("/vp/products/")
      ? ("direct-product" as const)
      : ("search-results" as const),
    priceStatus: "manual-check-required" as const,
    stockStatus: "manual-check-required" as const,
    linkCheckedAt: verifiedAt,
  };
};

const researchedPart = ({
  id,
  type,
  displayName,
  modelIds,
  sourceTitle,
  sourceUrl,
  searchKeyword,
  sourceType = "official-store",
  compatibleProductName,
  genuinePartNumber,
  replacementInterval,
  regional = false,
  verifiedAt = checkedAt,
  secondarySources = [],
}: {
  id: string;
  type: ConsumableCompatibility["type"];
  displayName: string;
  modelIds: string[];
  sourceTitle: string;
  sourceUrl: string;
  searchKeyword: string;
  sourceType?: SourceReference["sourceType"];
  compatibleProductName?: string;
  genuinePartNumber?: string;
  replacementInterval?: string;
  regional?: boolean;
  verifiedAt?: string;
  secondarySources?: Array<{
    title: string;
    url: string;
    sourceType?: SourceReference["sourceType"];
  }>;
}): ConsumableCompatibility => ({
  id,
  slug: id,
  type,
  displayName,
  compatibleProductName,
  genuinePartNumber,
  compatibleModelIds: modelIds,
  searchKeywords: [searchKeyword, displayName],
  replacementInterval,
  purchaseWarning: regional ? regionalWarning : domesticWarning,
  verificationStatus: "official",
  sources: [
    source(sourceTitle, sourceUrl, sourceType, verifiedAt),
    ...secondarySources.map((item) =>
      source(item.title, item.url, item.sourceType ?? "official-store", verifiedAt),
    ),
  ],
  affiliate: affiliate(searchKeyword, undefined, verifiedAt),
});

export const consumables: ConsumableCompatibility[] = [
  {
    id: "lg-puricare-m-filter",
    slug: "lg-puricare-m-filter-adq30041405",
    type: "all-in-one-filter",
    displayName: "LG 퓨리탈취청정 M 필터",
    genuinePartNumber: "ADQ30041405",
    compatibleProductName: "PFSALC01",
    compatibleModelIds: ["lg-as355nsna", "lg-as355ngna"],
    searchKeywords: ["ADQ30041405", "PFSALC01", "LG 퓨리탈취청정 M 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "LG전자 2026 B2B 공식 카탈로그 — 필터 모델명·부품번호·적용 제품",
        "https://www.lge.co.kr/kr/ebook/2026/january/b2b/catImage/628/20260102_b2b_catalogue.pdf",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(
      "LG ADQ30041405 PFSALC01 정품 필터",
      "https://www.coupang.com/vp/products/8763286247",
    ),
  },
  {
    id: "lg-puricare-g-filter",
    slug: "lg-puricare-g-filter-adq30041403",
    type: "all-in-one-filter",
    displayName: "LG 퓨리탈취청정 G 필터",
    genuinePartNumber: "ADQ30041403",
    compatibleProductName: "PFSACC01",
    compatibleModelIds: ["lg-as355nsah", "lg-as205nsja", "lg-as205ngja"],
    searchKeywords: ["ADQ30041403", "PFSACC01", "LG 퓨리탈취청정 G 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "LG전자 2026 B2B 공식 카탈로그 — 필터 모델명·부품번호·적용 제품",
        "https://www.lge.co.kr/kr/ebook/2026/january/b2b/catImage/628/20260102_b2b_catalogue.pdf",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(
      "LG ADQ30041403 PFSACC01 정품 필터",
      "https://www.coupang.com/vp/products/8941845170",
    ),
  },
  {
    id: "lg-360-micro-filter",
    slug: "lg-360-micro-filter-adq75133511",
    type: "pre-filter",
    displayName: "LG 360° 극세필터 6개입",
    genuinePartNumber: "ADQ75133511",
    compatibleProductName: "PFPNNC06",
    compatibleModelIds: [
      "lg-as355nsna",
      "lg-as355ngna",
      "lg-as355nsah",
      "lg-as205nsja",
      "lg-as205ngja",
    ],
    searchKeywords: ["ADQ75133511", "PFPNNC06", "LG 360 극세필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "LG전자 2026 B2B 공식 카탈로그 — 360° 극세필터 부품번호",
        "https://www.lge.co.kr/kr/ebook/2026/january/b2b/catImage/628/20260102_b2b_catalogue.pdf",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(
      "LG ADQ75133511 PFPNNC06 정품 극세필터",
      "https://www.coupang.com/vp/products/8946893297",
    ),
  },
  {
    id: "coway-4d-pre-filter",
    slug: "coway-4d-pre-filter",
    type: "pre-filter",
    displayName: "코웨이 노블 공기청정기 4D 프리필터",
    compatibleProductName: "4D 프리필터 2개",
    compatibleModelIds: ["coway-ap-4025d", "coway-ap-3024h", "coway-ap-2021a", "coway-ap-1521b"],
    searchKeywords: ["코웨이 AP-4025D AP-3024H AP-2021A AP-1521B 4D 프리필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "코웨이 공식 사용설명서 — AP-3024H·AP-4025D 필터 구성",
        "https://www.coway.com/core/product/fmanual/download/302",
        "official-manual",
      ),
      source(
        "코웨이 공식 사용설명서 — AP-1521B·AP-2021A 필터 구성",
        "https://www.coway.com/core/product/fmanual/download/116",
        "official-manual",
      ),
    ],
    affiliate: affiliate("코웨이 AP-2021A AP-1521B 정품 4D 프리필터"),
  },
  {
    id: "coway-4d-dimensional-filter",
    slug: "coway-4d-dimensional-filter",
    type: "all-in-one-filter",
    displayName: "코웨이 노블 공기청정기 4D 입체필터",
    compatibleProductName: "4D 입체필터 2개",
    compatibleModelIds: ["coway-ap-4025d", "coway-ap-3024h", "coway-ap-2021a", "coway-ap-1521b"],
    searchKeywords: ["코웨이 AP-4025D AP-3024H AP-2021A AP-1521B 4D 입체필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "코웨이 공식 사용설명서 — AP-3024H·AP-4025D 필터 구성",
        "https://www.coway.com/core/product/fmanual/download/302",
        "official-manual",
      ),
      source(
        "코웨이 공식 사용설명서 — AP-1521B·AP-2021A 필터 구성",
        "https://www.coway.com/core/product/fmanual/download/116",
        "official-manual",
      ),
    ],
    affiliate: affiliate("코웨이 AP-2021A AP-1521B 정품 4D 입체필터"),
  },
  {
    id: "coway-air-matching-filter",
    slug: "coway-air-matching-filter",
    type: "deodorizing-filter",
    displayName: "코웨이 노블 공기청정기 에어매칭필터",
    compatibleProductName: "에어매칭필터 4개",
    compatibleModelIds: ["coway-ap-4025d", "coway-ap-3024h", "coway-ap-2021a", "coway-ap-1521b"],
    searchKeywords: ["코웨이 AP-4025D AP-3024H AP-2021A AP-1521B 에어매칭필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "코웨이 공식 사용설명서 — AP-3024H·AP-4025D 필터 구성",
        "https://www.coway.com/core/product/fmanual/download/302",
        "official-manual",
      ),
      source(
        "코웨이 공식 사용설명서 — AP-1521B·AP-2021A 필터 구성",
        "https://www.coway.com/core/product/fmanual/download/116",
        "official-manual",
      ),
    ],
    affiliate: affiliate("코웨이 AP-2021A AP-1521B 정품 에어매칭필터"),
  },
  {
    id: "winix-tower-prime-plus-all-in-one-filter",
    slug: "winix-tower-prime-plus-all-in-one-filter",
    type: "all-in-one-filter",
    displayName: "위닉스 타워프라임 플러스 일체형 필터",
    compatibleProductName: "타워프라임 플러스 일체형 필터",
    compatibleModelIds: ["winix-attm115-mwk"],
    searchKeywords: ["ATTM115-MWK", "위닉스 타워프라임 플러스 일체형 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source("위닉스 공식몰 — 타워프라임 플러스 일체형 필터", "https://www.winix.com/product/1668"),
    ],
    affiliate: affiliate("위닉스 ATTM115-MWK 정품 일체형 필터"),
  },
  {
    id: "cuckoo-acf-wmt10-filter",
    slug: "cuckoo-acf-wmt10-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 공기청정기 필터",
    genuinePartNumber: "ACF-WMT10",
    compatibleProductName: "AC-24W·AC-25W·W70 계열용 필터",
    compatibleModelIds: ["cuckoo-ac-25w20fwh"],
    searchKeywords: ["ACF-WMT10", "AC-25W20FWH", "쿠쿠 정품 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "쿠쿠 공식몰 — 공기청정기 필터 ACF-WMT10 적용 모델",
        "https://www.cuckoo.co.kr/searchWord?searchWord=ACF-WMT10",
      ),
    ],
    affiliate: affiliate(
      "쿠쿠 ACF-WMT10 정품 필터",
      "https://www.coupang.com/vp/products/1919975207",
    ),
  },
  {
    id: "cuckoo-acf-ahmt10-filter",
    slug: "cuckoo-acf-ahmt10-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-28AH 계열 공기청정기 필터",
    genuinePartNumber: "ACF-AHMT10",
    compatibleProductName: "AC-28AH 계열용 필터",
    compatibleModelIds: ["cuckoo-ac-28ahnl20fnw"],
    searchKeywords: ["ACF-AHMT10", "AC-28AHNL20FNW", "쿠쿠 정품 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "쿠쿠 공식몰 — 공기청정기 필터 ACF-AHMT10 적용 모델",
        "https://www.cuckoo.co.kr/searchWord?searchWord=ACF-AHMT10",
      ),
    ],
    affiliate: affiliate("쿠쿠 ACF-AHMT10 정품 필터", coupangSearch("쿠쿠 정품 ACF-AHMT10")),
  },
  {
    id: "cuckoo-acf-tmt20-filter",
    slug: "cuckoo-acf-tmt20-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-T 계열 공기청정기 필터",
    genuinePartNumber: "ACF-TMT20",
    compatibleProductName: "AC-T 계열용 필터",
    compatibleModelIds: ["cuckoo-ac-17t20fwh"],
    searchKeywords: ["ACF-TMT20", "AC-17T20FWH", "쿠쿠 정품 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "쿠쿠 공식몰 — 공기청정기 필터 ACF-TMT20 적용 모델",
        "https://www.cuckoo.co.kr/searchWord?searchWord=ACF-TMT20",
      ),
    ],
    affiliate: affiliate(
      "쿠쿠 ACF-TMT20 정품 필터",
      "https://www.coupang.com/vp/products/7179000987",
    ),
  },
  {
    id: "dyson-bp04-k-carbon-filter",
    slug: "dyson-bp04-k-carbon-filter",
    type: "deodorizing-filter",
    displayName: "다이슨 K-카본 필터",
    compatibleProductName: "K-Carbon filter",
    compatibleModelIds: ["dyson-bp04"],
    searchKeywords: ["다이슨 BP04 K 카본 필터", "Dyson BP04 K-Carbon filter"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — BP04 K-카본 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/bp04",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("다이슨 BP04 정품 K 카본 필터"),
  },
  {
    id: "dyson-big-quiet-hepa-h13-filter",
    slug: "dyson-big-quiet-hepa-h13-filter",
    type: "hepa-filter",
    displayName: "다이슨 빅+콰이엇 HEPA H13 필터",
    compatibleProductName: "HEPA H13 filter",
    compatibleModelIds: ["dyson-bp03", "dyson-bp04"],
    searchKeywords: ["다이슨 BP03 BP04 HEPA H13 필터", "Dyson Big Quiet HEPA H13"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — BP03·BP04 HEPA H13 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/bp04",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("다이슨 BP03 BP04 정품 HEPA H13 필터"),
  },
  {
    id: "dyson-bp03-activated-carbon-filter",
    slug: "dyson-bp03-activated-carbon-filter",
    type: "deodorizing-filter",
    displayName: "다이슨 BP03 활성 탄소 필터",
    compatibleProductName: "Activated carbon filter",
    compatibleModelIds: ["dyson-bp03"],
    searchKeywords: ["다이슨 BP03 활성 탄소 필터", "Dyson BP03 activated carbon filter"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — BP03 활성 탄소 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/bp03",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("다이슨 BP03 정품 활성 탄소 필터"),
  },
  {
    id: "dyson-360-glass-hepa-carbon-filter",
    slug: "dyson-360-glass-hepa-carbon-filter",
    type: "all-in-one-filter",
    displayName: "다이슨 360° 글라스 HEPA+탄소 필터",
    compatibleProductName: "360° Glass HEPA+Carbon filter",
    compatibleModelIds: ["dyson-hp09", "dyson-tp09", "dyson-ph04"],
    searchKeywords: ["다이슨 HP09 TP09 PH04 360 글라스 HEPA 탄소 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "다이슨 코리아 공식 교체 부품 — 360° 글라스 HEPA+탄소 필터",
        "https://www.dyson.co.kr/support/replacement-parts/air-treatment/dp04",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("다이슨 HP09 TP09 PH04 정품 필터"),
  },
  {
    id: "xiaomi-5-series-mop-pad",
    slug: "xiaomi-5-series-mop-pad",
    type: "mop-pad",
    displayName: "Xiaomi 로봇청소기 5·5 Pro 물걸레 패드",
    compatibleProductName: "Xiaomi Robot Vacuum 5/5 Pro Mop Pad",
    compatibleModelIds: ["xiaomi-5-pro", "xiaomi-5"],
    searchKeywords: ["Xiaomi Robot Vacuum 5 5 Pro Mop Pad", "샤오미 5 Pro 물걸레 패드"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Xiaomi 글로벌 공식 액세서리 목록 — 5·5 Pro 물걸레 패드",
        "https://www.mi.com/global/product-list/vacuum-cleaner/vacuum-cleaner-accessories/",
        "manufacturer",
      ),
    ],
    affiliate: affiliate("샤오미 로봇청소기 5 Pro 정품 물걸레 패드"),
  },
  ...(
    [
      ["xiaomi-s20-dust-bin-filter", "dust-bin-filter", "Xiaomi S20 먼지통 필터", "Filter"],
      ["xiaomi-s20-main-brush", "main-brush", "Xiaomi S20 메인 브러시", "Main brush"],
      ["xiaomi-s20-side-brush", "side-brush", "Xiaomi S20 사이드 브러시", "Side brush"],
      ["xiaomi-s20-mop-pad", "mop-pad", "Xiaomi S20 물걸레 패드", "Mop pad"],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) => ({
    id,
    slug: id,
    type,
    displayName,
    compatibleProductName,
    compatibleModelIds: ["xiaomi-s20"],
    searchKeywords: [`Xiaomi Robot Vacuum S20 ${compatibleProductName}`, displayName],
    purchaseWarning: regionalWarning,
    verificationStatus: "official" as const,
    sources: [
      source(
        "Xiaomi 공식 S20 액세서리 페이지",
        "https://www.mi.com/uk/product/xiaomi-robot-vacuum-s20-accessories/",
        "manufacturer",
      ),
    ],
    affiliate: affiliate(`${displayName} 정품`),
  })),
  {
    id: "skmagic-all-in-one-care-filter",
    slug: "skmagic-all-in-one-care-filter",
    type: "all-in-one-filter",
    displayName: "SK매직 올인원 케어필터",
    compatibleProductName: "올인원 케어필터 1SET",
    compatibleModelIds: ["skmagic-acl15c1askwh"],
    searchKeywords: ["ACL15C1ASKWH 올인원 케어필터", "SK매직 올클린 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "SK매직 공식 제품 페이지 — ACL15C1ASKWH 기본 필터 구성",
        "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000062559",
      ),
    ],
    affiliate: affiliate("SK매직 ACL15C1ASKWH 정품 올인원 케어필터"),
  },
  {
    id: "blueair-cp7i-pac-filter",
    slug: "blueair-cp7i-pac-filter",
    type: "all-in-one-filter",
    displayName: "Blueair Classic Pro CP7i PAC 필터",
    compatibleProductName: "Classic Pro CP7i PAC Filter",
    compatibleModelIds: ["blueair-cp7i"],
    searchKeywords: ["Blueair CP7i PAC Filter", "블루에어 CP7i 정품 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Blueair 코리아 공식몰 — Classic Pro CP7i PAC 필터",
        "https://www.blueair.com/ko-kr/products/classic-pro-cp7i-pac-filter",
      ),
    ],
    affiliate: affiliate("블루에어 CP7i 정품 PAC 필터"),
  },
  {
    id: "blueair-dustmagnet-5200-combofilter",
    slug: "blueair-dustmagnet-5200-combofilter",
    type: "all-in-one-filter",
    displayName: "Blueair DustMagnet 5200 시리즈 ComboFilter",
    compatibleProductName: "DustMagnet ComboFilter 5200",
    compatibleModelIds: ["blueair-5240i", "blueair-5210i"],
    searchKeywords: ["Blueair DustMagnet ComboFilter 5200", "블루에어 5210i 5240i 필터"],
    replacementInterval: "최대 9개월(제조사 안내, 사용 환경에 따라 달라짐)",
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Blueair 코리아 공식몰 — DustMagnet ComboFilter 5200 적용 모델",
        "https://www.blueair.com/ko-kr/products/dustmagnet-combofilter-5201",
      ),
    ],
    affiliate: affiliate("블루에어 DustMagnet 5210i 5240i 정품 필터"),
  },
  {
    id: "roborock-saros-qrevo-s8-dust-bag",
    slug: "roborock-saros-qrevo-s8-dust-bag",
    type: "dust-bag",
    displayName: "Roborock Saros·Qrevo Curv·S8 MaxV Ultra 먼지봉투 6개입",
    compatibleProductName: "Official Dust Bag 6-Pack",
    compatibleModelIds: [
      "roborock-saros-z70",
      "roborock-s8-maxv-ultra",
      "roborock-qrevo-curv-2-flow",
      "roborock-qrevo-curv",
    ],
    searchKeywords: ["Roborock official dust bag Saros Qrevo Curv S8 MaxV Ultra"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "Roborock 공식몰 — Saros·Qrevo Curv·S8 MaxV Ultra 호환 먼지봉투",
        "https://us.roborock.com/products/roborock-dust-bag-6pcs-for-s8-maxv-ultra-s8-max-ultra-qrevo-series-qrevo-curv-series-qrevo-edge-series-saros-series-and-qv-series",
      ),
    ],
    affiliate: affiliate("로보락 Saros Qrevo Curv S8 MaxV Ultra 정품 먼지봉투"),
  },
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
    compatibleProductName: `X40 Ultra Accessory Cleaning Kit 포함 ${compatibleProductName}`,
    compatibleModelIds: ["dreame-x40-ultra"],
    searchKeywords: ["Dreame X40 Ultra Accessory Cleaning Kit", displayName],
    purchaseWarning: regionalWarning,
    verificationStatus: "official" as const,
    sources: [
      source(
        "Dreame 공식몰 — X40 Ultra 액세서리 클리닝 키트 구성과 호환 모델",
        "https://www.dreametech.com/products/x40-ultra-accessory-cleaning-kit",
      ),
    ],
    affiliate: affiliate(`${displayName} 정품`),
  })),
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
  {
    id: "narwal-freo-mop-pad",
    slug: "narwal-freo-mop-pad",
    type: "mop-pad",
    displayName: "Narwal Freo 시리즈 물걸레 패드",
    compatibleProductName: "Mop Pad",
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
      source("Narwal 공식 Freo 액세서리 호환표", "https://us.narwal.com/pages/freo-product"),
    ],
    affiliate: affiliate("나르왈 Freo 정품 물걸레 패드"),
  },
  {
    id: "narwal-freo-zero-tangle-roller",
    slug: "narwal-freo-zero-tangle-roller",
    type: "main-brush",
    displayName: "Narwal Freo 제로 탱글 롤러 브러시",
    compatibleProductName: "Zero-Tangling Roller Brush",
    compatibleModelIds: ["narwal-freo-z10", "narwal-freo-z-ultra", "narwal-freo-x-ultra"],
    searchKeywords: ["Narwal Zero-Tangling Roller Brush", "나르왈 Freo 롤러 브러시"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source("Narwal 공식 Freo 액세서리 호환표", "https://us.narwal.com/pages/freo-product"),
    ],
    affiliate: affiliate("나르왈 Freo 정품 제로 탱글 롤러 브러시"),
  },
  {
    id: "narwal-freo-dustbin-filter",
    slug: "narwal-freo-dustbin-filter",
    type: "dust-bin-filter",
    displayName: "Narwal Freo 먼지통 필터",
    compatibleProductName: "Dust Bin Filter",
    compatibleModelIds: ["narwal-freo-z10", "narwal-freo-z-ultra", "narwal-freo-x-ultra"],
    searchKeywords: ["Narwal Freo Dust Bin Filter", "나르왈 Freo 먼지통 필터"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source("Narwal 공식 Freo 액세서리 호환표", "https://us.narwal.com/pages/freo-product"),
    ],
    affiliate: affiliate("나르왈 Freo 정품 먼지통 필터"),
  },
  {
    id: "narwal-freo-side-brush",
    slug: "narwal-freo-side-brush",
    type: "side-brush",
    displayName: "Narwal Freo 사이드 브러시",
    compatibleProductName: "Side Brush",
    compatibleModelIds: ["narwal-freo-z-ultra", "narwal-freo-x-ultra", "narwal-freo"],
    searchKeywords: ["Narwal Freo Side Brush", "나르왈 Freo 사이드 브러시"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source("Narwal 공식 Freo 액세서리 호환표", "https://us.narwal.com/pages/freo-product"),
    ],
    affiliate: affiliate("나르왈 Freo 정품 사이드 브러시"),
  },
  {
    id: "narwal-freo-dust-bag",
    slug: "narwal-freo-dust-bag",
    type: "dust-bag",
    displayName: "Narwal Freo Z Ultra·Z10 베이스 스테이션 먼지봉투",
    compatibleProductName: "Base Station Dust Bag",
    compatibleModelIds: ["narwal-freo-z10", "narwal-freo-z-ultra"],
    searchKeywords: ["Narwal Freo Z10 Z Ultra Base Station Dust Bag"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source("Narwal 공식 Freo 액세서리 호환표", "https://us.narwal.com/pages/freo-product"),
    ],
    affiliate: affiliate("나르왈 Freo Z10 Z Ultra 정품 먼지봉투"),
  },
  {
    id: "irobot-combo-j-high-efficiency-filter",
    slug: "irobot-combo-j-high-efficiency-filter-4785883",
    type: "dust-bin-filter",
    displayName: "iRobot Roomba Combo j 시리즈 고효율 필터 3개입",
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
    displayName: "iRobot Roomba Combo i·e·j 시리즈 고효율 필터 3개입",
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
    displayName: "iRobot Roomba 105 필터 3개입",
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
  {
    id: "eufy-c20-dust-bag",
    slug: "eufy-c20-dust-bag-t290a110",
    type: "dust-bag",
    displayName: "eufy Omni C20 먼지봉투",
    genuinePartNumber: "T290A110",
    compatibleProductName: "Dust Bags for Robot Vacuum Omni C20",
    compatibleModelIds: ["eufy-omni-c20"],
    searchKeywords: ["eufy T290A110", "eufy Omni C20 Dust Bag"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source("eufy 공식몰 — Omni C20 호환 먼지봉투", "https://www.eufy.com/products/t290a110"),
    ],
    affiliate: affiliate(
      "eufy T290A110 Omni C20 정품 먼지봉투",
      coupangSearch("eufy 정품 T290A110 Omni C20 먼지봉투"),
    ),
  },
  ...(
    [
      [
        "eufy-c20-washable-filter",
        "dust-bin-filter",
        "eufy Omni C20 세척형 필터",
        "Washable Filter",
      ],
      ["eufy-c20-roller-brush", "main-brush", "eufy Omni C20 롤러 브러시", "Roller Brush"],
      ["eufy-c20-side-brush", "side-brush", "eufy Omni C20 사이드 브러시", "Side Brush"],
      ["eufy-c20-mop-cloth", "mop-pad", "eufy Omni C20 물걸레 패드", "Mop Cloth"],
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
        "eufy 공식 C20 액세서리 컬렉션 — Replacement Kit 구성",
        "https://www.eufy.com/collections/c20-omni-accessories",
      ),
    ],
    affiliate: affiliate(`${displayName} 정품`),
  })),
  {
    id: "eufy-x10-pro-side-brush",
    slug: "eufy-x10-pro-side-brush",
    type: "side-brush",
    displayName: "eufy X10 Pro Omni 사이드 브러시",
    compatibleProductName: "Side Brush for X10 Pro Omni",
    compatibleModelIds: ["eufy-x10-pro-omni"],
    searchKeywords: ["eufy X10 Pro Omni Side Brush", "유피 X10 Pro 사이드 브러시"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식 X10 Pro Omni 액세서리 컬렉션",
        "https://www.eufy.com/collections/x10-pro-omni-accessories",
      ),
    ],
    affiliate: affiliate("eufy X10 Pro Omni 정품 사이드 브러시"),
  },
  {
    id: "eufy-c28-filter",
    slug: "eufy-c28-filter",
    type: "dust-bin-filter",
    displayName: "eufy Omni C28 필터",
    compatibleProductName: "C28 Accessories Bundle 포함 Filter",
    compatibleModelIds: ["eufy-omni-c28"],
    searchKeywords: ["eufy Omni C28 Filter", "유피 C28 필터"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식 액세서리 구독 안내 — Omni C28 번들 구성",
        "https://www.eufy.com/accessories-subscription",
      ),
    ],
    affiliate: affiliate("eufy Omni C28 정품 필터"),
  },
  {
    id: "eufy-c28-dust-bag",
    slug: "eufy-c28-dust-bag",
    type: "dust-bag",
    displayName: "eufy Omni C28 먼지봉투",
    compatibleProductName: "C28 Accessories Bundle 포함 Dust Bag",
    compatibleModelIds: ["eufy-omni-c28"],
    searchKeywords: ["eufy Omni C28 Dust Bag", "유피 C28 먼지봉투"],
    purchaseWarning: regionalWarning,
    verificationStatus: "official",
    sources: [
      source(
        "eufy 공식 액세서리 구독 안내 — Omni C28 번들 구성",
        "https://www.eufy.com/accessories-subscription",
      ),
    ],
    affiliate: affiliate("eufy Omni C28 정품 먼지봉투"),
  },
  researchedPart({
    id: "coway-ap2219k-composite-filter",
    type: "all-in-one-filter",
    displayName: "코웨이 AP-2219K 복합 필터",
    compatibleProductName: "프리필터·맞춤형·탈취·HEPA 필터 구성",
    modelIds: ["coway-ap-2219k"],
    sourceTitle: "코웨이 공식 보도자료 — AP-2219K 4단계 듀얼 필터 구성",
    sourceUrl: "https://company.coway.com/ko/newsroom/press/154",
    sourceType: "manufacturer",
    searchKeyword: "코웨이 AP-2219K 정품 필터",
  }),
  researchedPart({
    id: "winix-zero-s-replacement-filter",
    type: "hepa-filter",
    displayName: "위닉스 제로 S 교체 필터 세트",
    modelIds: ["winix-azse430-jwk"],
    sourceTitle: "위닉스 공식 제로 S 제품 및 필터 찾기",
    sourceUrl: "https://www.winix.com/product/843",
    sourceType: "manufacturer",
    searchKeyword: "위닉스 AZSE430-JWK 정품 필터",
  }),
  researchedPart({
    id: "winix-tower-edge-all-in-one-filter",
    type: "all-in-one-filter",
    displayName: "위닉스 타워 엣지 올인원 필터",
    modelIds: ["winix-at8e430-mwk"],
    sourceTitle: "위닉스 공식 타워 엣지 제품 정보",
    sourceUrl: "https://www.winix.com/product/1538",
    sourceType: "manufacturer",
    searchKeyword: "위닉스 AT8E430-MWK 정품 올인원 필터",
  }),
  researchedPart({
    id: "winix-tower-prime-all-in-one-filter",
    type: "all-in-one-filter",
    displayName: "위닉스 타워 프라임 올인원 필터",
    modelIds: ["winix-aprm833-jwk"],
    sourceTitle: "위닉스 공식 타워 프라임 제품 정보",
    sourceUrl: "https://www.winix.com/product/1211",
    sourceType: "manufacturer",
    searchKeyword: "위닉스 APRM833-JWK 정품 올인원 필터",
  }),
  researchedPart({
    id: "winix-master-s-all-in-one-filter",
    type: "all-in-one-filter",
    displayName: "위닉스 마스터 S 올인원 필터",
    modelIds: ["winix-amsh993-jsk"],
    sourceTitle: "위닉스 공식 마스터 S 제품 정보",
    sourceUrl: "https://www.winix.com/product/852",
    sourceType: "manufacturer",
    searchKeyword: "위닉스 AMSH993-JSK 정품 올인원 필터",
  }),
  researchedPart({
    id: "cuckoo-ac23-total-care-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-23AH10FNW 토탈케어 청정필터",
    modelIds: ["cuckoo-ac-23ah10fnw"],
    sourceTitle: "쿠쿠 공식몰 — AC-23AH10FNW 토탈케어 청정필터 시스템",
    sourceUrl: "https://www.cuckoo.co.kr/mall/productView?productNo=8691",
    searchKeyword: "쿠쿠 AC-23AH10FNW 정품 필터",
  }),
  researchedPart({
    id: "cuckoo-ac14-total-care-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-14L10FEW 토탈케어 안심필터",
    modelIds: ["cuckoo-ac-14l10few"],
    sourceTitle: "쿠쿠 공식 렌탈몰 — AC-14L10FEW 토탈케어 안심필터",
    sourceUrl: "https://www.cuckoo.co.kr/rental/productView?cateUid=31&idx=860",
    searchKeyword: "쿠쿠 AC-14L10FEW 정품 필터",
  }),
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
      sourceType: "official-manual",
      searchKeyword,
      regional: true,
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
      sourceTitle: "샤오미 코리아 공식 X10+ 액세서리 사양",
      sourceUrl: "https://www.mi.com/kr/product/xiaomi-robot-vacuum-x10-plus-accessories/specs/",
      sourceType: "manufacturer",
      searchKeyword,
    }),
  ),
  researchedPart({
    id: "skmagic-acl131-filter",
    type: "all-in-one-filter",
    displayName: "SK매직 ACL131 정품 필터",
    genuinePartNumber: "FLTACLP131WH",
    modelIds: ["skmagic-acl-131t0"],
    sourceTitle: "SK매직 공식몰 — ACL131 공기청정기 필터",
    sourceUrl: "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000059559",
    searchKeyword: "SK매직 FLTACLP131WH 정품 필터",
  }),
  researchedPart({
    id: "skmagic-acl20-all-in-one-care-filter",
    type: "all-in-one-filter",
    displayName: "SK매직 ACL20 올인원 케어필터",
    modelIds: ["skmagic-acl20c1askwh"],
    sourceTitle: "SK매직 공식몰 — ACL20 구성품과 필터 안내",
    sourceUrl: "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000067380",
    searchKeyword: "SK매직 ACL20C1ASKWH 정품 올인원 케어필터",
  }),
  researchedPart({
    id: "skmagic-acl25-all-in-one-care-filter",
    type: "all-in-one-filter",
    displayName: "SK매직 ACL25 올인원 케어필터",
    modelIds: ["skmagic-acl25c1askce"],
    sourceTitle: "SK매직 공식몰 — ACL25 제품 및 필터 안내",
    sourceUrl: "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000069683",
    searchKeyword: "SK매직 ACL25C1ASKCE 정품 올인원 케어필터",
  }),
  researchedPart({
    id: "skmagic-acl130z-filter",
    type: "all-in-one-filter",
    displayName: "SK매직 ACL130P·ACL130Z 정품 필터",
    genuinePartNumber: "FLTACL130PWH",
    modelIds: ["skmagic-acl130z0skpn"],
    sourceTitle: "SK매직 공식몰 — ACL130P·ACL130Z 공기청정기 필터",
    sourceUrl: "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000056901",
    searchKeyword: "SK매직 FLTACL130PWH 정품 필터",
  }),
  researchedPart({
    id: "wells-al106-filter-set",
    type: "all-in-one-filter",
    displayName: "웰스 AL106 정품 필터 구성",
    compatibleProductName: "프리·생활맞춤·탈취·제로클리어 HEPA H14",
    modelIds: ["wells-al106"],
    sourceTitle: "교원 웰스 공식 제품 정보 — AL106 필터 구성",
    sourceUrl: "https://m.kyowonwells.com/Product/Detail?grpIdx=47&productIdx=49",
    sourceType: "manufacturer",
    searchKeyword: "웰스 AL106 정품 필터",
  }),
  researchedPart({
    id: "wells-tornado-allcare-filter",
    type: "all-in-one-filter",
    displayName: "웰스 토네이도 올케어 필터",
    compatibleProductName: "프리·생활맞춤·올케어 필터",
    modelIds: ["wells-an730", "wells-an734"],
    sourceTitle: "교원 웰스 공식 제품 정보 — AN730·AN734 필터 구성",
    sourceUrl: "https://m.kyowonwells.com/Product/Detail?grpIdx=182&productIdx=373",
    sourceType: "manufacturer",
    searchKeyword: "웰스 AN730 AN734 정품 올케어 필터",
  }),
  researchedPart({
    id: "wells-aq107-filter-set",
    type: "all-in-one-filter",
    displayName: "웰스 AQ107 정품 필터 구성",
    compatibleProductName: "프리·생활맞춤·탈취·클리어 HEPA",
    modelIds: ["wells-aq107"],
    sourceTitle: "교원 웰스 공식 제품 정보 — AQ107 필터 구성",
    sourceUrl: "https://www.kyowonwells.com/Product/Detail?grpIdx=1394&productIdx=926",
    sourceType: "manufacturer",
    searchKeyword: "웰스 AQ107 정품 필터",
  }),
  researchedPart({
    id: "wells-am315-combi-filter",
    type: "all-in-one-filter",
    displayName: "웰스 AM315 콤비 필터",
    compatibleProductName: "HEPA·탈취 콤비 필터",
    modelIds: ["wells-am315"],
    sourceTitle: "교원 웰스 공식 제품 정보 — AM315 필터 구성",
    sourceUrl: "https://m.kyowonwells.com/Product/Detail?grpIdx=49&productIdx=54",
    sourceType: "manufacturer",
    searchKeyword: "웰스 AM315 정품 콤비 필터",
  }),
  researchedPart({
    id: "blueair-cp9i-main-filter",
    type: "all-in-one-filter",
    displayName: "블루에어 Classic Pro CP9i 메인 필터",
    compatibleProductName: "CP9i Main Filter 3개 구성",
    modelIds: ["blueair-cp9i"],
    sourceTitle: "블루에어 공식 Classic Pro CP7i·CP9i 사용설명서",
    sourceUrl:
      "https://www.blueair.com/on/demandware.static/-/Library-Sites-blueair-us-content-library/default/dw0772a0f7/support/User%20Manual%20Classic%20Pro_CP7i_CP9i%20Series.pdf",
    sourceType: "official-manual",
    searchKeyword: "블루에어 CP9i 정품 메인 필터",
    regional: true,
  }),
  researchedPart({
    id: "blueair-3410-particle-carbon-filter",
    type: "all-in-one-filter",
    displayName: "블루에어 Blue 3410 Particle + Carbon 필터",
    modelIds: ["blueair-3410"],
    sourceTitle: "블루에어 코리아 공식 Blue 3410 제품 및 필터 안내",
    sourceUrl: "https://www.blueair.com/ko-kr/products/blue-3410",
    sourceType: "manufacturer",
    searchKeyword: "블루에어 3410 정품 필터",
    replacementInterval: "약 6개월(사용 환경에 따라 다름)",
  }),
  ...(
    [
      ["roborock-s10-maxv-main-brush", "main-brush", "로보락 S10 MaxV Ultra DuoDivide 메인 브러시"],
      [
        "roborock-s10-maxv-side-brush",
        "side-brush",
        "로보락 S10 MaxV Ultra FlexiArm 사이드 브러시",
      ],
      ["roborock-s10-maxv-mop-pad", "mop-pad", "로보락 S10 MaxV Ultra VibraRise 물걸레"],
      ["roborock-s10-maxv-dust-bag", "dust-bag", "로보락 S10 MaxV Ultra RockDock 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["roborock-s10-maxv-ultra"],
      sourceTitle: "로보락 코리아 공식 S10 MaxV Ultra 제품 구성",
      sourceUrl: "https://kr.roborock.com/pages/roborock-s10-maxv-ultra",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
    }),
  ),
  ...(
    [
      ["dreame-x50s-main-brush", "main-brush", "드리미 X50s Pro 메인 브러시"],
      ["dreame-x50s-side-brush", "side-brush", "드리미 X50s Pro 사이드 브러시"],
      ["dreame-x50s-dust-box-filter", "dust-bin-filter", "드리미 X50s Pro 먼지통 필터"],
      ["dreame-x50s-mop-pad", "mop-pad", "드리미 X50s Pro 물걸레 패드"],
      ["dreame-x50s-dust-bag", "dust-bag", "드리미 X50s Pro 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["dreame-x50s-pro-master", "dreame-x50s-pro-ultra"],
      sourceTitle: "드리미 코리아 공식 X50s Pro 제품 및 구성품 안내",
      sourceUrl:
        "https://store.kr.dreametech.com/products/%EB%93%9C%EB%A6%AC%EB%AF%B8-x50s-pro-ultra-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
    }),
  ),
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
      modelIds: ["dreame-x40s-pro-ultra"],
      sourceTitle: "드리미 코리아 공식 X40s Pro Ultra 제품 안내",
      sourceUrl: "https://kr.dreametech.com/products?category=15",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
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
      modelIds: ["dreame-l10s-pro-ultra-heat"],
      sourceTitle: "드리미 공식 L10s Pro Ultra Heat 제품 구성",
      sourceUrl: "https://global.dreametech.com/products/l10s-pro-ultra",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
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
  ...(
    [
      ["narwal-flow-dustbin-filter", "dust-bin-filter", "나르왈 Flow 먼지통 필터"],
      ["narwal-flow-main-brush", "main-brush", "나르왈 Flow 제로탱글 플로팅 브러시"],
      ["narwal-flow-side-brush", "side-brush", "나르왈 Flow 안티탱글 사이드 브러시"],
      ["narwal-flow-track-mop", "mop-pad", "나르왈 Flow 크롤러 물걸레"],
      ["narwal-flow-dust-bag", "dust-bag", "나르왈 Flow 베이스 스테이션 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["narwal-flow"],
      sourceTitle: "나르왈 공식 Flow 액세서리 세트 구성",
      sourceUrl: "https://jp.narwal.com/products/narwal-flow-accessories-set",
      sourceType: "official-store",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
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
      sourceUrl:
        "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-q3/154/category/58/display/1/",
      searchKeyword: `${displayName} 정품`,
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
    displayName: "에브리봇 일회용 물걸레 청소포 30매",
    compatibleProductName: "쓰리스핀용 중간패드에 부착하는 일회용 청소포",
    modelIds: ["everybot-ts402m"],
    sourceTitle: "에브리봇 공식몰 — 일회용 물걸레 청소포 30매",
    sourceUrl:
      "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EB%AC%BC%EA%B1%B8%EB%A0%88-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EC%9D%BC%ED%9A%8C%EC%9A%A9-%EC%B2%AD%EC%86%8C%ED%8F%AC30%EB%A7%A4/93/",
    searchKeyword: "에브리봇 쓰리스핀 EVO 일회용 청소포 30매 정품",
    verifiedAt: "2026-08-03",
  }),
  ...(
    [
      ["eufy-s2-filter", "dust-bin-filter", "eufy Omni S2 교체 필터"],
      ["eufy-s2-main-brush", "main-brush", "eufy Omni S2 롤러 브러시"],
      ["eufy-s2-side-brush", "side-brush", "eufy Omni S2 사이드 브러시"],
      ["eufy-s2-roller-mop", "mop-pad", "eufy Omni S2 롤러 물걸레"],
      ["eufy-s2-dust-bag", "dust-bag", "eufy Omni S2 먼지봉투"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      modelIds: ["eufy-omni-s2"],
      sourceTitle: "eufy 공식 Omni S2 액세서리 컬렉션",
      sourceUrl: "https://www.eufy.com/collections/omni-s2-accessories",
      searchKeyword: `${displayName} 정품`,
      regional: true,
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
      sourceTitle: "eufy 공식 S1 Pro 정품 액세서리 키트",
      sourceUrl: "https://us.eufy.com/products/t29c2001",
      searchKeyword: `${displayName} 정품`,
      regional: true,
    }),
  ),
  researchedPart({
    id: "irobot-clean-base-autowash-dust-bag",
    type: "dust-bag",
    displayName: "iRobot Clean Base·AutoWash 먼지봉투 3개입",
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
    displayName: "iRobot Combo·i·e·j 시리즈 엣지 브러시 3개입",
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
    displayName: "iRobot Roomba Combo j9+ 세척형 물걸레 패드 2개입",
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
  ...(
    [
      [
        "roborock-saros-z70-main-brush",
        "main-brush",
        "Roborock Saros Z70 메인 브러시",
        "Main Brush for Roborock Saros Z70",
      ],
      [
        "roborock-saros-z70-side-brush",
        "side-brush",
        "Roborock Saros Z70 사이드 브러시",
        "Side Brush for Saros Series",
      ],
      [
        "roborock-saros-z70-filter",
        "dust-bin-filter",
        "Roborock Saros Z70 세척형 필터 2개입",
        "Washable Filter 2-Pack",
      ],
      [
        "roborock-saros-z70-mop-cloth",
        "mop-pad",
        "Roborock Saros Z70 물걸레 패드 4개입",
        "Mop Cloth 4-Pack",
      ],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["roborock-saros-z70"],
      sourceTitle: "Roborock 공식 Saros Z70 제품 페이지 — 정품 교체 부품",
      sourceUrl: "https://us.roborock.com/products/roborock-saros-z70",
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-08-04",
      secondarySources: [
        {
          title: "Roborock 공식 액세서리 목록 — Saros Z70 호환 부품",
          url: "https://us.roborock.com/collections/accessories",
        },
      ],
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
      ],
      [
        "eufy-x10-pro-filter",
        "dust-bin-filter",
        "eufy X10 Pro Omni 세척형 필터 2개입",
        "T29E80W1",
        "https://www.eufy.com/products/t29e80w1",
      ],
      [
        "eufy-x10-pro-mop-cloth",
        "mop-pad",
        "eufy X10 Pro Omni 세척형 물걸레 패드 2개입",
        "T29E7031",
        "https://www.eufy.com/us/products/t29e7031",
      ],
      [
        "eufy-x10-pro-dust-bag",
        "dust-bag",
        "eufy X10 Pro Omni 대용량 먼지봉투 6개입",
        "T29F70A2",
        "https://www.eufy.com/products/t29f70a2",
      ],
    ] as const
  ).map(([id, type, displayName, genuinePartNumber, sourceUrl]) =>
    researchedPart({
      id,
      type,
      displayName,
      genuinePartNumber,
      modelIds: ["eufy-x10-pro-omni"],
      sourceTitle: `eufy 공식몰 — X10 Pro Omni 호환 ${displayName}`,
      sourceUrl,
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-08-04",
      secondarySources: [
        {
          title: "eufy 공식 X10 Pro Omni 교체 부품 키트 구성",
          url: "https://www.eufy.com/products/t29g00r1",
        },
      ],
    }),
  ),
  ...(
    [
      ["eufy-c28-side-brush", "side-brush", "eufy Omni C28 사이드 브러시"],
      ["eufy-c28-main-brush", "main-brush", "eufy Omni C28 롤러 브러시와 가드"],
      ["eufy-c28-roller-mop", "mop-pad", "eufy Omni C28 롤러 물걸레"],
    ] as const
  ).map(([id, type, displayName]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName: "C28 Replacement Kit T291VAR0 포함 정품 교체 부품",
      modelIds: ["eufy-omni-c28"],
      sourceTitle: "eufy 공식몰 — Omni C28 교체 키트 구성과 호환 모델",
      sourceUrl: "https://www.eufy.com/products/t291var0",
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-08-04",
      secondarySources: [
        {
          title: "eufy 공식 Omni C28 제품 페이지 — DuoSpiral 브러시·롤러 물걸레",
          url: "https://www.eufy.com/products/t211a110",
          sourceType: "manufacturer",
        },
      ],
    }),
  ),
  researchedPart({
    id: "xiaomi-5-series-anti-tangle-side-brush",
    type: "side-brush",
    displayName: "Xiaomi Robot Vacuum 5·5 Pro 엉킴 방지 사이드 브러시 2개입",
    compatibleProductName: "Robot Vacuum 5/5 Pro Anti-tangle Side Brush",
    genuinePartNumber: "OV81GL-BS",
    modelIds: ["xiaomi-5", "xiaomi-5-pro"],
    sourceTitle: "Xiaomi Global 공식 액세서리 — 5·5 Pro 엉킴 방지 사이드 브러시",
    sourceUrl: "https://www.mi.com/global/product/xiaomi-robot-vacuum-anti-tangle-side-brush/",
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
