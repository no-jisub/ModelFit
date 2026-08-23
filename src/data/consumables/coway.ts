import {
  affiliate,
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
];
