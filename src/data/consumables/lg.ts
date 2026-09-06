import { affiliate, domesticWarning, source, type ConsumableRecord } from "./shared";

export const lgConsumableRecords: ConsumableRecord[] = [
  {
    id: "lg-puricare-m-filter",
    slug: "lg-puricare-m-filter-adq30041405",
    type: "all-in-one-filter",
    displayName: "LG 퓨리탈취청정 M 필터",
    genuinePartNumber: "ADQ30041405",
    compatibleProductName: "PFSALC01 · AS355NSNA/NGNA 1회 교체 시 2개 필요",
    compatibleModelIds: ["lg-as355nsna", "lg-as355ngna"],
    searchKeywords: ["ADQ30041405", "PFSALC01", "LG 퓨리탈취청정 M 필터"],
    replacementInterval: "약 1년 (사용 환경과 제품의 필터 수명 알림에 따라 달라짐)",
    purchaseWarning: domesticWarning + " 메인 필터는 물로 세척하지 마세요.",
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
      "https://link.coupang.com/a/gDwSqU3CAC",
      "2026-08-30",
    ),
  },
  {
    id: "lg-puricare-g-filter",
    slug: "lg-puricare-g-filter-adq30041403",
    type: "all-in-one-filter",
    displayName: "LG 퓨리탈취청정 G 필터",
    genuinePartNumber: "ADQ30041403",
    compatibleProductName: "PFSACC01 · AS355NSAH는 2개, AS205NSJA/NGJA는 1개 필요",
    compatibleModelIds: ["lg-as355nsah", "lg-as205nsja", "lg-as205ngja"],
    searchKeywords: ["ADQ30041403", "PFSACC01", "LG 퓨리탈취청정 G 필터"],
    replacementInterval: "약 1년 (사용 환경과 제품의 필터 수명 알림에 따라 달라짐)",
    purchaseWarning: domesticWarning + " 메인 필터는 물로 세척하지 마세요.",
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
      "2026-08-19",
      "쿠팡 파트너스 링크 생성 제한 상품",
    ),
  },
  {
    id: "lg-360-micro-filter",
    slug: "lg-360-micro-filter-adq75133511",
    type: "pre-filter",
    displayName: "LG 360° 극세필터",
    genuinePartNumber: "ADQ75133511",
    compatibleProductName: "PFPNNC06 · 공식 판매 구성 6개입",
    compatibleModelIds: [
      "lg-as355nsna",
      "lg-as355ngna",
      "lg-as355nsah",
      "lg-as205nsja",
      "lg-as205ngja",
    ],
    searchKeywords: ["ADQ75133511", "PFPNNC06", "LG 360 극세필터"],
    purchaseWarning:
      domesticWarning +
      " 극세필터는 메인 교체 필터와 구분하며, 약 한 달마다 진공청소기나 부드러운 솔로 청소하세요.",
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
      "https://link.coupang.com/a/gDv010uXdc",
      "2026-08-30",
    ),
  },
];
