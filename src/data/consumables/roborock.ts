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
  {
    id: "roborock-s8-qrevo-curv-compatible-dust-bag",
    slug: "roborock-s8-qrevo-curv-compatible-dust-bag",
    type: "dust-bag",
    displayName: "로보락 S8 MaxV Ultra·Qrevo Curv 호환 먼지봉투",
    compatibleProductName: "호환 먼지봉투 · 10개",
    compatibleModelIds: ["roborock-s8-maxv-ultra", "roborock-qrevo-curv"],
    searchKeywords: ["로보락 S8 MaxV Ultra Qrevo Curv 호환 먼지봉투 10개"],
    purchaseWarning:
      "판매 페이지에 S8 MaxV Ultra 또는 Qrevo Curv용 옵션이 선택됐는지 구매 직전에 확인하세요.",
    verificationStatus: "official",
    sources: [
      source(
        "Roborock 공식몰 — S8 MaxV Ultra·Qrevo Curv 계열 먼지봉투 규격 참고",
        "https://us.roborock.com/products/roborock-dust-bag-6pcs-for-q-revo",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      "로보락 S8 MaxV Ultra Qrevo Curv 호환 먼지봉투 10개",
      "https://link.coupang.com/a/g0C65ZvwB2",
      "2026-09-13",
      undefined,
      {
        name: "S8 MaxV Ultra·Qrevo Curv 호환 먼지봉투",
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 S8 MaxV Ultra와 Qrevo Curv 적용을 표기한 타사 먼지봉투입니다. 로보락 정품이 아닙니다.",
        partNumber: "S8 MaxV Ultra·Qrevo Curv 호환",
        packageLabel: "먼지봉투 10개",
      },
    ),
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
      verifiedAt: "2026-09-13",
      directUrl: "https://link.coupang.com/a/g0Dmwwt5Z6",
      affiliateProductOption: {
        name: `${displayName.replace("로보락 ", "")} 호환상품`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 로보락 S10 MaxV Ultra 적용을 표기한 옵션형 호환상품입니다. 현재 소모품 종류와 구성 수량을 확인하세요.",
        partNumber: "S10 MaxV Ultra 호환",
        packageLabel: "선택 옵션의 구성 확인 필요",
      },
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
      directUrl:
        id === "roborock-saros-z70-mop-cloth"
          ? "https://link.coupang.com/a/g1Xqj7lr1V"
          : id === "roborock-saros-z70-filter"
            ? "https://link.coupang.com/a/haMaiEktvo"
            : id === "roborock-saros-z70-side-brush"
              ? "https://link.coupang.com/a/haMbmncdAO"
              : "https://link.coupang.com/a/haMcmCJ5b2",
      affiliateProductOption:
        id === "roborock-saros-z70-mop-cloth"
          ? {
              name: "Saros Z70 호환 물걸레 옵션",
              kind: "compatible",
              verification: "seller-claimed",
              description:
                "판매 페이지가 Roborock Saros Z70용 물걸레와 먼지봉투 옵션을 제공하는 호환상품으로 표기했습니다. 물걸레 옵션을 선택했는지 구매 전에 확인하세요.",
              partNumber: "Saros Z70 호환",
              packageLabel: "물걸레 옵션 · 판매 페이지 구성 확인",
            }
          : {
              name: `Saros Z70 호환 ${displayName.replace("Roborock Saros Z70 ", "")}`,
              kind: "compatible",
              verification: "seller-claimed",
              description:
                "판매 페이지가 Roborock Saros Z70용 소모품으로 표기한 타사 상품입니다. 현재 항목과 같은 부품 옵션 및 구성 수량을 구매 전에 확인하세요.",
              partNumber: "Saros Z70 호환",
              packageLabel: "판매 페이지에서 선택 옵션과 수량 확인",
            },
      verifiedAt: "2026-09-19",
      secondarySources: [
        {
          title: "Roborock 공식 액세서리 목록 — Saros Z70 호환 부품",
          url: "https://us.roborock.com/pages/accessories",
        },
      ],
    }),
  ),
];
