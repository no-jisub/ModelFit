import {
  unavailableAffiliate,
  domesticWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const winixConsumableRecords: ConsumableRecord[] = [
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
    affiliate: unavailableAffiliate("위닉스 ATTM115-MWK 정품 일체형 필터"),
  },
  ...[
    {
      id: "winix-zero-s-dust-filter",
      type: "dust-filter" as const,
      name: "마이크로 집진필터",
      number: "CAF-I0H3",
      url: "https://www.winix.com/product/4",
    },
    {
      id: "winix-zero-s-deodorizing-filter",
      type: "deodorizing-filter" as const,
      name: "탈취필터",
      number: "CAF-I0D1",
      url: "https://www.winix.com/product/2",
    },
  ].map(({ id, type, name, number, url }) => ({
    ...researchedPart({
      id,
      type,
      displayName: "위닉스 제로 S " + name,
      genuinePartNumber: number,
      modelIds: ["winix-azse430-jwk"],
      sourceTitle: "위닉스 공식몰 — 제로 S " + name,
      sourceUrl: url,
      searchKeyword: "위닉스 AZSE430-JWK " + number + " 정품 필터",
      replacementInterval: "약 6~12개월 (하루 24시간 사용 기준, 사용 환경에 따라 달라짐)",
      verifiedAt: "2026-09-11",
      secondarySources: [
        {
          title: "위닉스 AZSE430 시리즈 공식 설명서 — 교체 필터와 관리 방법 (16~20쪽)",
          url: "https://cdn.winix.com/uploadData/manual/3609084973/818120381773378.pdf",
          sourceType: "official-manual",
        },
      ],
      directUrl:
        id === "winix-zero-s-dust-filter" ? "https://link.coupang.com/a/g0AMuL3U4G" : undefined,
      affiliateProductOption:
        id === "winix-zero-s-dust-filter"
          ? {
              name: "CAF-I0H3 호환 집진필터",
              kind: "compatible",
              verification: "seller-claimed",
              description:
                "판매 페이지가 AZSE430 계열과 CAF-I0H3 호환을 표기한 타사 집진필터입니다. 위닉스 정품이 아닙니다.",
              partNumber: "CAF-I0H3 호환",
              packageLabel: "집진필터 1개",
            }
          : undefined,
      purchaseUnavailable: id !== "winix-zero-s-dust-filter",
    }),
    purchaseWarning:
      domesticWarning +
      " 집진필터와 탈취필터는 각각 교체하는 부품이며 물세척하면 안 됩니다. 프리필터는 반영구 사용하며 월 2회 청소합니다. 세트 상품 구매 시 두 교체 필터의 포함 여부를 확인하세요.",
  })),
  researchedPart({
    id: "winix-tower-edge-all-in-one-filter",
    type: "all-in-one-filter",
    displayName: "위닉스 타워 엣지 올인원 필터",
    modelIds: ["winix-at8e430-mwk"],
    sourceTitle: "위닉스 공식 타워 엣지 제품 정보",
    sourceUrl: "https://www.winix.com/product/1538",
    sourceType: "manufacturer",
    searchKeyword: "위닉스 AT8E430-MWK 정품 올인원 필터",
    directUrl: "https://www.coupang.com/vp/products/7368403017",
    verifiedAt: "2026-09-11",
  }),
  researchedPart({
    id: "winix-tower-prime-all-in-one-filter",
    type: "all-in-one-filter",
    displayName: "위닉스 타워 프라임 일체형 필터",
    compatibleProductName: "타워 프라임 일체형 필터",
    modelIds: ["winix-aprm833-jwk"],
    sourceTitle: "위닉스 공식몰 — 타워 프라임 일체형 필터",
    sourceUrl: "https://www.winix.com/product/142",
    sourceType: "official-store",
    searchKeyword: "위닉스 APRM833-JWK 정품 일체형 필터",
    directUrl: "https://www.coupang.com/vp/products/8692963466",
    verifiedAt: "2026-09-11",
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
    purchaseUnavailable: true,
  }),
];
