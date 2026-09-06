import {
  unavailableAffiliate,
  domesticWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const cowayConsumableRecords: ConsumableRecord[] = [
  {
    id: "coway-4d-pre-filter",
    slug: "coway-4d-pre-filter",
    type: "pre-filter",
    displayName: "코웨이 노블 공기청정기 4D 프리필터",
    compatibleProductName: "4D 프리필터 2개",
    compatibleModelIds: ["coway-ap-4025d", "coway-ap-3024h", "coway-ap-2021a", "coway-ap-1521b"],
    searchKeywords: ["코웨이 AP-4025D AP-3024H AP-2021A AP-1521B 4D 프리필터"],
    purchaseWarning:
      domesticWarning +
      " 4D 프리필터는 교체 주기가 정해진 필터가 아니라 2주마다 진공청소기 또는 물로 세척해 재사용하는 부품입니다.",
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
    verifiedAt: "2026-09-06",
    affiliate: unavailableAffiliate("코웨이 AP-2021A AP-1521B 정품 4D 프리필터"),
  },
  {
    id: "coway-4d-dimensional-filter",
    slug: "coway-4d-dimensional-filter",
    type: "all-in-one-filter",
    displayName: "코웨이 노블 공기청정기 4D 입체필터",
    compatibleProductName: "4D 입체필터 2개",
    compatibleModelIds: ["coway-ap-4025d", "coway-ap-3024h", "coway-ap-2021a", "coway-ap-1521b"],
    searchKeywords: ["코웨이 AP-4025D AP-3024H AP-2021A AP-1521B 4D 입체필터"],
    replacementInterval: "12개월 (최대 풍량으로 하루 8시간 사용 기준이며 환경에 따라 달라짐)",
    purchaseWarning:
      domesticWarning + " 탈취강화필터와 4D 에어클린 V 케어필터가 합쳐진 복합형 필터입니다.",
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
    verifiedAt: "2026-09-06",
    affiliate: unavailableAffiliate("코웨이 AP-2021A AP-1521B 정품 4D 입체필터"),
  },
  {
    id: "coway-air-matching-filter",
    slug: "coway-air-matching-filter",
    type: "deodorizing-filter",
    displayName: "코웨이 노블 공기청정기 에어매칭필터",
    compatibleProductName: "에어매칭필터 4개",
    compatibleModelIds: ["coway-ap-4025d", "coway-ap-3024h", "coway-ap-2021a", "coway-ap-1521b"],
    searchKeywords: ["코웨이 AP-4025D AP-3024H AP-2021A AP-1521B 에어매칭필터"],
    replacementInterval: "4개월 또는 6개월 (요금제와 사용 환경에 따라 달라짐)",
    purchaseWarning:
      domesticWarning + " 에어매칭필터는 생활 환경에 맞춰 6종 중 2종을 선택해 장착하는 필터입니다.",
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
    verifiedAt: "2026-09-06",
    affiliate: unavailableAffiliate("코웨이 AP-2021A AP-1521B 정품 에어매칭필터"),
  },
  researchedPart({
    id: "coway-ap2219k-composite-filter",
    type: "all-in-one-filter",
    displayName: "코웨이 AP-2219K 일체형 복합필터",
    compatibleProductName: "탈취필터와 초미세먼지 집진필터가 결합된 교체 필터",
    modelIds: ["coway-ap-2219k"],
    sourceTitle: "코웨이 AP-1818C·AP-2219K 공식 사용설명서 — 필터 구성·교환 방법 (11·21~22쪽)",
    sourceUrl: "https://www.coway.com/core/product/fmanual/download/122",
    sourceType: "official-manual",
    searchKeyword: "코웨이 AP-2219K 정품 일체형 복합필터",
    replacementInterval: "12개월 (하루 8시간, 풍량 3단 사용 기준이며 사용 환경에 따라 달라짐)",
    verifiedAt: "2026-09-06",
    secondarySources: [
      {
        title: "코웨이 공식 필터·소모품 목록 — AP-1818C·AP-2219K 전용 일체형 복합필터",
        url: "https://www.coway.com/product/filters-supplies/all/all",
        sourceType: "official-store",
      },
    ],
    purchaseUnavailable: true,
  }),
];
