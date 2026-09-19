import {
  affiliate,
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
      "쿠쿠 ACF-WMT10 호환 필터",
      "https://link.coupang.com/a/g0Dn7O5fGu",
      "2026-09-13",
      undefined,
      {
        name: "ACF-WMT10 호환 집진·탈취 일체형 필터",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 ACF-WMT10 호환을 표기한 타사 일체형 필터입니다. 쿠쿠 정품이 아닙니다.",
        partNumber: "ACF-WMT10 호환",
        packageLabel: "집진·탈취 일체형 필터 1개",
      },
    ),
  },
  {
    id: "cuckoo-acf-ahmt10-filter",
    slug: "cuckoo-acf-ahmt10-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-28AH 전용 필터",
    genuinePartNumber: "ACF-AHMT10",
    compatibleProductName: "ACF-AHMT10 · 2개입 1세트",
    compatibleModelIds: ["cuckoo-ac-28ahnl20fnw"],
    searchKeywords: ["ACF-AHMT10", "AC-28AHNL20FNW", "쿠쿠 정품 필터"],
    purchaseWarning: domesticWarning,
    verificationStatus: "official",
    sources: [
      source(
        "쿠쿠 공식몰 — ACF-AHMT10 AC-28AH 전용 필터 2개입 1세트",
        "https://www.cuckoo.co.kr/mall/productView?productNo=7461",
      ),
    ],
    affiliate: affiliate(
      "쿠쿠 ACF-AHMT10 호환 필터",
      "https://link.coupang.com/a/g0AOOyyGB2",
      "2026-09-13",
      undefined,
      {
        name: "ACF-AHMT10 호환 복합필터",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 AC-28AH 및 ACF-AHMT10 호환을 표기한 타사 필터입니다. 쿠쿠 정품이 아닙니다.",
        partNumber: "ACF-AHMT10 호환",
        packageLabel: "혼합 필터 세트 · 판매 페이지에서 구성 확인",
      },
    ),
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
    directUrl: "https://link.coupang.com/a/haMeDL2YzQ",
    affiliateProductOption: {
      name: "쿠쿠 AC-23AH10FNW 호환 헤파·탈취 필터 세트",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 AC-23AH10FNW 적용을 표기한 타사 헤파·탈취 필터 세트입니다. 사용하는 본체 모델과 세트 구성을 구매 전에 확인하세요.",
      partNumber: "AC-23AH10FNW 호환",
      packageLabel: "헤파·탈취 필터 세트",
    },
    verifiedAt: "2026-09-19",
  }),
  researchedPart({
    id: "cuckoo-ac14-total-care-filter",
    type: "all-in-one-filter",
    displayName: "쿠쿠 AC-14L10FEW 토탈케어 안심필터",
    modelIds: ["cuckoo-ac-14l10few"],
    sourceTitle: "쿠쿠 공식 렌탈몰 — AC-14L10FEW 토탈케어 안심필터",
    sourceUrl: "https://www.cuckoo.co.kr/rental/productView?cateUid=31&idx=860",
    searchKeyword: "쿠쿠 AC-14L10FEW 정품 필터",
    directUrl: "https://link.coupang.com/a/haDUrxSl5w",
    affiliateProductOption: {
      name: "쿠쿠 AC-14L10FEW 호환 공기청정기 필터",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 쿠쿠 AC-14L10FEW 호환을 표기한 타사 필터입니다. 쿠쿠 정품이 아니므로 적용 모델을 구매 전에 확인하세요.",
      partNumber: "AC-14L10FEW 호환",
      packageLabel: "판매 페이지에서 구성 확인",
    },
    verifiedAt: "2026-09-19",
  }),
];
