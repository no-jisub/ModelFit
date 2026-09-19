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
      [
        "ecovacs-n20-main-brush",
        "main-brush",
        "ECOVACS N20 메인 브러시",
        "Main Brush ×1",
        undefined,
      ],
      [
        "ecovacs-n20-side-brush",
        "side-brush",
        "ECOVACS N20 사이드 브러시",
        "Side Brush ×4",
        "https://www.coupang.com/vp/products/8299580323",
      ],
      [
        "ecovacs-n20-filter",
        "dust-bin-filter",
        "ECOVACS N20 필터",
        "Filter ×3",
        "https://www.coupang.com/vp/products/8323150982",
      ],
    ] as const
  ).map(([id, type, displayName, compatibleProductName, directUrl]) => ({
    id,
    slug: id,
    type,
    displayName,
    compatibleProductName: `N20 PRO PLUS Buddy Kit · ${compatibleProductName}`,
    compatibleModelIds: ["ecovacs-deebot-n20-pro-plus"],
    searchKeywords: ["ECOVACS N20 PRO PLUS Buddy Kit", displayName],
    purchaseWarning: `${regionalWarning} 표시 수량은 N20 PRO PLUS/N20 PLUS 공식 Buddy Kit 한 세트의 구성입니다.`,
    verificationStatus: "official" as const,
    sources: [
      source(
        "ECOVACS 공식몰 — N20 PRO PLUS/N20 PLUS Buddy Kit 구성",
        "https://www.ecovacs.com/us/shop/accessories/buddy-kit-n20",
        "official-store",
        "2026-09-10",
      ),
    ],
    affiliate: affiliate(
      `에코백스 N20 PRO PLUS 정품 ${compatibleProductName}`,
      directUrl,
      directUrl ? "2026-09-14" : "2026-09-10",
      directUrl ? "쿠팡 파트너스 링크 생성 제한 상품" : undefined,
      directUrl
        ? {
            name: displayName.replace("ECOVACS ", "") + " 정품 후보",
            kind: "genuine",
            verification: "seller-claimed",
            description:
              "판매 페이지가 ECOVACS N20 PRO PLUS용 소모품으로 표기한 상품입니다. 파트너스 링크 생성이 제한되어 일반 상품 링크로 제공합니다.",
            packageLabel: compatibleProductName,
          }
        : undefined,
    ),
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
      compatibleProductName: displayName.replace("에코백스 ", ""),
      modelIds: ["ecovacs-deebot-x12"],
      sourceTitle: "에코백스 공식 DEEBOT X12 지원 페이지 — 교체 부품과 설명서",
      sourceUrl: "https://help.ecovacs.com/uk/support/deebot-x12-omnicyclone",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      regional: true,
      verifiedAt: "2026-09-19",
      directUrl: "https://link.coupang.com/a/haCfSfvtYW",
      affiliateProductOption: {
        name: `DEEBOT X12 ${displayName.replace("에코백스 DEEBOT X12 ", "")} 호환 옵션`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에코백스 DEEBOT X12 OmniCyclone용 소모품 옵션으로 표기한 호환상품입니다. 선택한 부품 종류와 구성 수량을 구매 전에 확인하세요.",
        packageLabel: "선택 옵션의 구성 확인 필요",
      },
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
      compatibleProductName: displayName.replace("에코백스 ", ""),
      modelIds: ["ecovacs-deebot-x11"],
      sourceTitle: "에코백스 코리아 공식 DEEBOT X11 제품 및 사용설명서",
      sourceUrl: "https://www.ecovacs.com/kr/deebot-robotic-vacuum-cleaner/deebot-x11-omnicyclone",
      sourceType: "manufacturer",
      searchKeyword: `${displayName} 정품`,
      verifiedAt: "2026-09-19",
      directUrl: "https://link.coupang.com/a/haA9B1uMhM",
      affiliateProductOption: {
        name: `DEEBOT X11 ${displayName.replace("에코백스 DEEBOT X11 ", "")} 호환 옵션`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에코백스 X11 Omni용 소모품 옵션으로 표기한 호환상품입니다. 선택한 부품 종류와 구성 수량을 구매 전에 확인하세요.",
        packageLabel: "선택 옵션의 구성 확인 필요",
      },
    }),
  ),
  ...(
    [
      [
        "ecovacs-x9-t80-filter",
        "dust-bin-filter",
        "에코백스 X9·T80 항균 필터",
        "Antibacterial Filter · 1개",
        undefined,
      ],
      [
        "ecovacs-x9-t80-dust-bag",
        "dust-bag",
        "에코백스 X9·T80 항균 먼지봉투",
        "Antibacterial Dust Bag · 6개입",
        "2~3개월마다 (제조사 권장, 사용량에 따라 달라짐)",
      ],
      [
        "ecovacs-x9-t80-roller-mop",
        "mop-pad",
        "에코백스 X9·T80 항균 롤러 물걸레",
        "Antibacterial Roller Mop · 1개",
        undefined,
      ],
    ] as const
  ).map(([id, type, displayName, compatibleProductName, replacementInterval]) =>
    researchedPart({
      id,
      type,
      displayName,
      compatibleProductName,
      modelIds: ["ecovacs-deebot-x9", "ecovacs-deebot-t80"],
      sourceTitle: "ECOVACS 공식 T80 제품 페이지 — X9·T80 호환 액세서리 목록",
      sourceUrl: "https://www.ecovacs.com/us/shop/deebot-robotic-vacuum-cleaner/deebot-t80-omni",
      sourceType: "official-store",
      searchKeyword: `${displayName} 정품`,
      replacementInterval,
      regional: true,
      verifiedAt: "2026-09-19",
      directUrl:
        id === "ecovacs-x9-t80-filter"
          ? "https://link.coupang.com/a/haA3WBN9hI"
          : id === "ecovacs-x9-t80-dust-bag"
            ? "https://link.coupang.com/a/haKQxXfm68"
            : "https://link.coupang.com/a/haA8zcXf7Q",
      affiliateProductOption: {
        name: `DEEBOT T80 ${compatibleProductName} 호환 옵션`,
        kind: "compatible",
        verification: "seller-claimed",
        description:
          "판매 페이지가 에코백스 T80 Omni용 소모품으로 표기한 호환상품입니다. 이 데이터는 X9·T80 공식 공용 부품 기준이므로 X9 사용자는 판매자에게 적용 여부를 다시 확인하세요.",
        packageLabel:
          id === "ecovacs-x9-t80-dust-bag" ? "먼지봉투 10매" : "선택 옵션의 구성 확인 필요",
      },
    }),
  ),
  researchedPart({
    id: "ecovacs-x9-main-brush",
    type: "main-brush",
    displayName: "에코백스 DEEBOT X9 안티탱글 메인 브러시",
    compatibleProductName: "Anti-Tangle Main Brush · 1개",
    modelIds: ["ecovacs-deebot-x9"],
    sourceTitle: "ECOVACS 공식몰 — X11·X9 호환 안티탱글 메인 브러시 1개",
    sourceUrl: "https://www.ecovacs.com/us/shop/accessories/main-brush-t50-max",
    sourceType: "official-store",
    searchKeyword: "에코백스 X9 정품 안티탱글 메인 브러시",
    regional: true,
    verifiedAt: "2026-09-19",
    directUrl: "https://link.coupang.com/a/haKNfbeJfU",
    affiliateProductOption: {
      name: "DEEBOT X9 Pro Omni 호환 메인 브러시 옵션",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 에코백스 X9 Pro Omni용 필터·메인·사이드 브러시·먼지봉투 옵션을 제공하는 호환상품입니다. 메인 브러시 옵션과 수량을 구매 전에 확인하세요.",
      packageLabel: "메인 브러시 옵션 선택",
    },
  }),
  researchedPart({
    id: "ecovacs-x9-side-brush",
    type: "side-brush",
    displayName: "에코백스 DEEBOT X9 ARClean 사이드 브러시",
    compatibleProductName: "ARClean Anti-Tangle Side Brush · 2개입",
    modelIds: ["ecovacs-deebot-x9"],
    sourceTitle: "ECOVACS 공식몰 — X11·X9·X12 호환 ARClean 사이드 브러시 2개입",
    sourceUrl: "https://www.ecovacs.com/us/shop/accessories/side-brush-x9",
    sourceType: "official-store",
    searchKeyword: "에코백스 X9 정품 ARClean 사이드 브러시 2개입",
    regional: true,
    verifiedAt: "2026-09-19",
    directUrl: "https://link.coupang.com/a/haKOBSLa0W",
    affiliateProductOption: {
      name: "DEEBOT X9 Pro Omni 호환 사이드 브러시 옵션",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 에코백스 X9 Pro Omni용 필터·메인·사이드 브러시·롤러 옵션을 제공하는 호환상품입니다. 사이드 브러시 옵션과 수량을 구매 전에 확인하세요.",
      packageLabel: "사이드 브러시 옵션 선택",
    },
  }),
  researchedPart({
    id: "ecovacs-t80-main-brush",
    type: "main-brush",
    displayName: "에코백스 DEEBOT T80 안티탱글 메인 브러시",
    compatibleProductName: "Anti-Tangle Main Brush · 1개",
    modelIds: ["ecovacs-deebot-t80"],
    sourceTitle: "ECOVACS 공식몰 — T80 호환 안티탱글 메인 브러시 1개",
    sourceUrl: "https://www.ecovacs.com/us/shop/accessories/main-brush-x8",
    sourceType: "official-store",
    searchKeyword: "에코백스 T80 정품 안티탱글 메인 브러시",
    regional: true,
    verifiedAt: "2026-09-19",
    directUrl: "https://link.coupang.com/a/haA6oYgGdw",
    affiliateProductOption: {
      name: "DEEBOT T80 메인 브러시 호환 옵션",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 에코백스 T80 Omni용 세제·먼지봉투·물걸레·필터·브러시 옵션을 제공하는 호환상품입니다. 메인 브러시 옵션과 구성 수량을 구매 전에 확인하세요.",
      packageLabel: "메인 브러시 옵션 선택",
    },
  }),
  researchedPart({
    id: "ecovacs-t80-side-brush",
    type: "side-brush",
    displayName: "에코백스 DEEBOT T80 ARClean 사이드 브러시",
    compatibleProductName: "ARClean Anti-Tangle Side Brush · 2개입",
    modelIds: ["ecovacs-deebot-t80"],
    sourceTitle: "ECOVACS 공식몰 — T80 호환 ARClean 사이드 브러시 2개입",
    sourceUrl: "https://www.ecovacs.com/us/shop/accessories/side-brush-t80",
    sourceType: "official-store",
    searchKeyword: "에코백스 T80 정품 ARClean 사이드 브러시 2개입",
    regional: true,
    verifiedAt: "2026-09-19",
    directUrl: "https://link.coupang.com/a/haA5o9YwXk",
    affiliateProductOption: {
      name: "DEEBOT T80 사이드 브러시 호환 옵션",
      kind: "compatible",
      verification: "seller-claimed",
      description:
        "판매 페이지가 에코백스 T80 Omni용 소모품 옵션으로 표기한 호환상품입니다. 사이드 브러시 옵션과 구성 수량을 구매 전에 확인하세요.",
      packageLabel: "사이드 브러시 옵션 선택",
    },
  }),
];
