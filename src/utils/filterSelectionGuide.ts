export interface FilterSelectionGuide {
  deodorization: string;
  environment: string;
  replacement: string;
}

// Current M5/V2/H comparison: LG ADQ30041401 product page, st_0415.jpg.
// Older M/G remain distinct: LG support/solutions-20151419829672.
// Environment descriptions summarize selection advice, not compatibility claims.
const guides: Record<string, FilterSelectionGuide> = {
  ADQ30041405: {
    deodorization: "강",
    environment: "냄새 관리가 필요한 주방·반려동물 생활 공간",
    replacement: "약 1년",
  },
  ADQ30041403: {
    deodorization: "중",
    environment: "먼지와 생활 냄새를 함께 관리할 공간",
    replacement: "약 1년",
  },
  ADQ30041401: {
    deodorization: "중",
    environment: "냄새가 비교적 적은 거실·침실",
    replacement: "약 1년",
  },
  ADQ30041412: {
    deodorization: "약",
    environment: "냄새가 거의 없고 먼지 제거가 중심인 공간",
    replacement: "약 1년",
  },
  ADQ30041414: {
    deodorization: "강 · V2 대비 약 2배",
    environment: "주방·반려동물 생활 공간 등 냄새 관리가 필요한 곳",
    replacement: "약 1년",
  },
};

export function getFilterSelectionGuide(partId: string, itemCode?: string) {
  if (partId === "lg-as205ngja-compatible-hepa-filter") {
    return {
      deodorization: "없음",
      environment: "탈취 기능 없이 먼지 포집 용도로 사용할 공간",
      replacement: "판매자 안내 기준",
    } satisfies FilterSelectionGuide;
  }
  return itemCode ? guides[itemCode] : undefined;
}
