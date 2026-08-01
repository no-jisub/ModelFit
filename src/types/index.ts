export type ApplianceCategory = "air-purifier" | "robot-vacuum";

export type VerificationStatus = "official" | "seller-confirmed" | "user-reported" | "unverified";

export type ConsumableType =
  | "hepa-filter"
  | "deodorizing-filter"
  | "pre-filter"
  | "all-in-one-filter"
  | "dust-bin-filter"
  | "dust-bag"
  | "main-brush"
  | "side-brush"
  | "mop-pad";

export interface SourceReference {
  title: string;
  url: string;
  sourceType: "manufacturer" | "official-manual" | "official-store" | "seller" | "other";
  checkedAt: string;
}

export interface AffiliateLinkData {
  searchKeyword: string;
  directUrl?: string;
  enabled: boolean;
  status: "direct-product" | "search-results" | "unavailable";
  priceStatus: "manual-check-required" | "recently-checked";
  stockStatus: "manual-check-required" | "in-stock" | "out-of-stock";
  linkCheckedAt: string;
}

export interface ConsumableCompatibility {
  id: string;
  slug: string;
  type: ConsumableType;
  displayName: string;
  genuinePartNumber?: string;
  compatibleProductName?: string;
  compatibleModelIds: string[];
  searchKeywords: string[];
  replacementInterval?: string;
  purchaseWarning?: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
  affiliate: AffiliateLinkData;
}

export interface ApplianceModel {
  id: string;
  slug: string;
  category: ApplianceCategory;
  brandId: string;
  brandName: string;
  brandNameEn?: string;
  modelName: string;
  modelCode: string;
  aliases: string[];
  series?: string;
  shortDescription: string;
  consumableNote?: string;
  modelNumberLocation?: string;
  releaseDate?: string;
  consumableIds: string[];
  sources: SourceReference[];
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  supportedCategories: ApplianceCategory[];
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  category: "기초" | "공기청정기" | "로봇청소기" | "관리";
  steps: { title: string; description: string }[];
  checklist: string[];
  cautions: string[];
}
