import type { CategoryId } from "@/data/categories";

export type ApplianceCategory = CategoryId;

export type VerificationStatus = "official" | "seller-confirmed" | "user-reported" | "unverified";

export type PartNumberStatus = "confirmed" | "not-listed" | "researching";

export type ConsumableType =
  | "hepa-filter"
  | "dust-filter"
  | "deodorizing-filter"
  | "pre-filter"
  | "custom-filter"
  | "all-in-one-filter"
  | "dust-bin-filter"
  | "dust-bag"
  | "main-brush"
  | "side-brush"
  | "mop-pad";

export interface SourceReference {
  id: string;
  title: string;
  url: string;
  sourceType: "manufacturer" | "official-manual" | "official-store" | "seller" | "other";
  checkedAt: string;
}

export type PurchaseChannel = "official" | "coupang" | "other";

export interface PurchaseLinkData {
  id: string;
  label: string;
  url: string;
  channel: PurchaseChannel;
  linkType: "direct-product";
  isAffiliate: boolean;
  purchaseScope?: "individual" | "bundle";
  checkedAt: string;
}

export type ProductOptionKind = "genuine" | "compatible";

export type ProductOptionVerification =
  "official-genuine" | "verified-compatible" | "seller-claimed" | "unverified";

export interface ConsumableProductOption {
  id: string;
  name: string;
  kind: ProductOptionKind;
  verification: ProductOptionVerification;
  description: string;
  itemCode?: string;
  modelLabels: Record<string, string>;
  packageLabel?: string;
  sources: SourceReference[];
  purchaseLinks: PurchaseLinkData[];
  guidanceLinks: GuidanceLinkData[];
}

export interface ConsumableCompatibility {
  id: string;
  slug: string;
  type: ConsumableType;
  displayName: string;
  image?: ModelImage;
  genuinePartNumber?: string;
  partNumberStatus: PartNumberStatus;
  compatibleModelIds: string[];
  searchKeywords: string[];
  maintenance?: MaintenancePresentation;
  compatibilities: ModelConsumable[];
  purchaseWarning?: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
  productOptions: ConsumableProductOption[];
}

export interface ModelImage {
  src: string;
  alt: string;
  sourceUrl: string;
  checkedAt: string;
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
  image?: ModelImage;
  releaseDate?: string;
  consumableIds: string[];
  sources: SourceReference[];
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  status: "draft" | "review" | "published" | "archived";
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  supportedCategories: ApplianceCategory[];
  officialDomains: string[];
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  category: "basics" | "maintenance" | ApplianceCategory;
  steps: { title: string; description: string }[];
  checklist: string[];
  cautions: string[];
}

export interface GuidanceLinkData {
  id: string;
  label: string;
  url: string;
  channel: PurchaseChannel;
  checkedAt: string;
  linkType: "official-reference";
}
export interface PartConfigurationPresentation {
  itemCode?: string;
  requiredQuantity?: string;
  salesPackage?: string;
  composition?: string;
}
export interface MaintenancePresentation {
  mode: "정기 교체" | "세척 후 재사용" | "상태에 따라 교체" | "정기 관리";
  detail: string;
}
export interface ModelConsumable {
  id: string;
  modelId: string;
  consumableId: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
  evidenceScope: "legacy-unscoped" | "scoped";
  sources: SourceReference[];
  configuration?: PartConfigurationPresentation;
}
