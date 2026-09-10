import {
  affiliate,
  regionalWarning,
  researchedPart,
  source,
  type ConsumableRecord,
} from "./shared";

export const roborockConsumableRecords: ConsumableRecord[] = [
  {
    id: "roborock-saros-qrevo-s8-dust-bag",
    slug: "roborock-saros-qrevo-s8-dust-bag",
    type: "dust-bag",
    displayName: "Roborock Saros·Qrevo Curv·S8 MaxV Ultra 먼지봉투",
    compatibleProductName: "Roborock 공식 먼지봉투 · 6개입",
    compatibleModelIds: [
      "roborock-saros-z70",
      "roborock-s8-maxv-ultra",
      "roborock-qrevo-curv-2-flow",
      "roborock-qrevo-curv",
    ],
    searchKeywords: ["Roborock official dust bag Saros Qrevo Curv S8 MaxV Ultra"],
    purchaseWarning: `${regionalWarning} Saros·Qrevo Curv·S8 MaxV Ultra 계열에 호환되는 공식 6개입 구성입니다.`,
    verificationStatus: "official",
    sources: [
      source(
        "Roborock 공식몰 — Saros·Qrevo Curv·S8 MaxV Ultra 호환 먼지봉투 6개입",
        "https://us.roborock.com/products/roborock-dust-bag-6pcs-for-q-revo",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate("로보락 Saros Qrevo Curv S8 MaxV Ultra 정품 먼지봉투 6개입"),
  },
  ...(
    [
      [
        "roborock-s10-maxv-main-brush",
        "main-brush",
        "로보락 S10 MaxV Ultra DuoDivide 메인 브러시",
        "DuoDivide™ 메인 브러시",
      ],
      [
        "roborock-s10-maxv-side-brush",
        "side-brush",
        "로보락 S10 MaxV Ultra FlexiArm 사이드 브러시",
        "FlexiArm™ 아크 사이드 브러시",
      ],
      [
        "roborock-s10-maxv-mop-pad",
        "mop-pad",
        "로보락 S10 MaxV Ultra VibraRise 물걸레",
        "VibraRise® 5.0 물걸레 패드",
      ],
      [
        "roborock-s10-maxv-dust-bag",
        "dust-bag",
        "로보락 S10 MaxV Ultra RockDock 먼지봉투",
        "RockDock® 일회용 먼지봉투",
      ],
    ] as const
  ).map(([id, type, displayName, compatibleProductName]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["roborock-s10-maxv-ultra"],
      sourceTitle: "로보락 코리아 공식 S10 MaxV Ultra — 브러시·물걸레·RockDock 구성",
      sourceUrl: "https://kr.roborock.com/pages/roborock-s10-maxv-ultra",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      verifiedAt: "2026-09-10",
      purchaseUnavailable: true,
    }),
  ),
  ...(
    [
      [
        "roborock-saros-z70-main-brush",
        "main-brush",
        "Roborock Saros Z70 메인 브러시",
        "Main Brush for Roborock Saros Z70 · 1개",
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
        "Roborock Saros Z70 세척형 필터",
        "Washable Filter · 2개입",
      ],
      [
        "roborock-saros-z70-mop-cloth",
        "mop-pad",
        "Roborock Saros Z70 물걸레 패드",
        "Mop Cloth · 4개입",
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
      verifiedAt: "2026-09-10",
      secondarySources: [
        {
          title: "Roborock 공식 액세서리 목록 — Saros Z70 호환 부품",
          url: "https://us.roborock.com/pages/accessories",
        },
      ],
      purchaseUnavailable: true,
    }),
  ),
];
