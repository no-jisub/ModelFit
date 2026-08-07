import type {
  ApplianceCategory,
  ConsumableType,
  PartNumberStatus,
  VerificationStatus,
} from "@/types";

export const categoryLabels: Record<ApplianceCategory, string> = {
  "air-purifier": "공기청정기",
  "robot-vacuum": "로봇청소기",
};

export const statusLabels: Record<VerificationStatus, string> = {
  official: "공식 출처 확인",
  "seller-confirmed": "판매자 확인",
  "user-reported": "사용자 제보",
  unverified: "미검증",
};

export type VerificationContext = "source" | "model" | "compatibility";

export function getVerificationLabel(
  status: VerificationStatus,
  context: VerificationContext = "source",
) {
  if (status !== "official") return statusLabels[status];
  if (context === "model") return "공식 모델 확인";
  if (context === "compatibility") return "공식 호환 확인";
  return statusLabels.official;
}

export const partNumberStatusLabels: Record<PartNumberStatus, string> = {
  confirmed: "부품번호 확인",
  "not-listed": "공식 자료에 번호 미표기",
  researching: "부품번호 추가 조사 중",
};

export function getPartNumberStatus(
  partNumber?: string,
  explicitStatus?: PartNumberStatus,
): PartNumberStatus {
  return explicitStatus ?? (partNumber?.trim() ? "confirmed" : "researching");
}

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
