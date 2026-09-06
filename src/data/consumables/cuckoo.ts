import {
  affiliate,
  unavailableAffiliate,
  domesticWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const cuckooConsumableRecords: ConsumableRecord[] = [
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
        "쿠쿠 공식몰 — ACF-WMT10 및 AC-24W·AC-25W·W70 계열 호환 안내",
        "https://www.cuckoo.co.kr/mall/productView?productNo=4547",
      ),
    ],
    affiliate: affiliate(
      "쿠쿠 ACF-WMT10 정품 필터",
      "https://link.coupang.com/a/gle6sSgGOa",
      "2026-08-19",
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
    affiliate: unavailableAffiliate("쿠쿠 ACF-AHMT10 정품 필터"),
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
    replacementInterval: "약 1년 (사용 환경에 따라 달라짐)",
    purchaseWarning:
      domesticWarning +
      " 프리필터는 훼손되지 않았다면 청소·세척해 사용하며 ACF-TMT20 교체 필터와 구분하세요.",
    verificationStatus: "official",
    sources: [
      source(
        "쿠쿠 공식몰 — ACF-TMT20 및 AC-T 계열 호환 안내",
        "https://www.cuckoo.co.kr/mall/productView?productNo=4623",
      ),
    ],
    affiliate: affiliate(
      "쿠쿠 ACF-TMT20 정품 필터",
      "https://link.coupang.com/a/gle76e3jKC",
      "2026-08-19",
    ),
  },
  researchedPart({
    id: "cuckoo-ac23-total-care-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-23AH10FNW 토탈케어 청정필터",
    modelIds: ["cuckoo-ac-23ah10fnw"],
    sourceTitle: "쿠쿠 공식몰 — AC-23AH10FNW 토탈케어 청정필터 시스템",
    sourceUrl: "https://www.cuckoo.co.kr/mall/productView?productNo=8691",
    searchKeyword: "쿠쿠 AC-23AH10FNW 정품 필터",
    purchaseUnavailable: true,
  }),
  researchedPart({
    id: "cuckoo-ac14-total-care-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-14L10FEW 토탈케어 안심필터",
    modelIds: ["cuckoo-ac-14l10few"],
    sourceTitle: "쿠쿠 공식 렌탈몰 — AC-14L10FEW 토탈케어 안심필터",
    sourceUrl: "https://www.cuckoo.co.kr/rental/productView?cateUid=31&idx=860",
    searchKeyword: "쿠쿠 AC-14L10FEW 정품 필터",
    purchaseUnavailable: true,
  }),
];
