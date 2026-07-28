import type { ApplianceCategory, ConsumableType, VerificationStatus } from "@/types";

export const categoryLabels: Record<ApplianceCategory, string> = {
  "air-purifier": "공기청정기",
  "robot-vacuum": "로봇청소기",
};

export const statusLabels: Record<VerificationStatus, string> = {
  official: "공식 확인",
  "seller-confirmed": "판매자 확인",
  "user-reported": "사용자 제보",
  unverified: "미검증",
};

export const partTypeLabels: Record<ConsumableType, string> = {
  "hepa-filter": "HEPA 필터",
  "deodorizing-filter": "탈취 필터",
  "pre-filter": "프리필터",
  "all-in-one-filter": "일체형 필터",
  "dust-bin-filter": "먼지통 필터",
  "dust-bag": "먼지봉투",
  "main-brush": "메인브러시",
  "side-brush": "사이드브러시",
  "mop-pad": "물걸레 패드",
};
