import type { ApplianceModel } from "@/types";
import { catalogModels } from "./catalogModels";

/**
 * 공개 서비스에는 제조사 공식 자료에서 모델명이 확인된 항목만 노출합니다.
 * 화면 검증용 데모 모델은 운영 데이터에서 완전히 제외했습니다.
 */
export const models: ApplianceModel[] = [...catalogModels];
