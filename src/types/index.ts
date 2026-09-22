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
  title: string;
  url: string;
  sourceType: "manufacturer" | "official-manual" | "official-store" | "seller" | "other";
  checkedAt: string;
}

export interface AffiliateLinkData {
  searchKeyword: string;
  directUrl?: string;
  isAffiliate: boolean;
  restrictionNote?: string;
  productOption?: {
    name: string;
    kind: ProductOptionKind;
    verification: Exclude<ProductOptionVerification, "official-genuine">;
    description: string;
    partNumber?: string;
    packageLabel?: string;
  };
  enabled: boolean;
  status: "direct-product" | "search-results" | "unavailable";
  priceStatus: "manual-check-required" | "recently-checked";
  stockStatus: "manual-check-required" | "in-stock" | "out-of-stock";
  linkCheckedAt: string;
}

export type PurchaseChannel = "official" | "coupang" | "other";

export interface PurchaseLinkData {
  id: string;
  label: string;
  url: string;
  channel: PurchaseChannel;
  linkType: "official-reference" | "direct-product" | "search-results";
  isAffiliate: boolean;
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
  partNumber?: string;
  packageLabel?: string;
  sources: SourceReference[];
  purchaseLinks: PurchaseLinkData[];
}

export interface ConsumableCompatibility {
  id: string;
  slug: string;
  type: ConsumableType;
  displayName: string;
  genuinePartNumber?: string;
  partNumberStatus: PartNumberStatus;
  compatibleProductName?: string;
  compatibleModelIds: string[];
  searchKeywords: string[];
  replacementInterval?: string;
  purchaseWarning?: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
  affiliate: AffiliateLinkData;
  purchaseLinks: PurchaseLinkData[];
  productOptions: ConsumableProductOption[];
}

export interface ModelImage {
  src: string;
  alt: string;
  sourceUrl: string;
  checkedAt: string;
}

export interface ImportedCatalogEntry {
  brandId: string;
  category: ApplianceCategory;
  modelName: string;
  modelCode: string;
  series?: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceType: SourceReference["sourceType"];
  verifiedAt: string;
  releaseDate?: string;
  releaseSourceUrl?: string;
  aliases?: string[];
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
  image?: ModelImage;
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
