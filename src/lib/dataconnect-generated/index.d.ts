import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum PublishStatus {
  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
};

export enum SourceType {
  MANUFACTURER = "MANUFACTURER",
  OFFICIAL_MANUAL = "OFFICIAL_MANUAL",
  OFFICIAL_STORE = "OFFICIAL_STORE",
  SELLER = "SELLER",
  OTHER = "OTHER",
};

export enum VerificationStatus {
  OFFICIAL = "OFFICIAL",
  SELLER_CONFIRMED = "SELLER_CONFIRMED",
  USER_REPORTED = "USER_REPORTED",
  UNVERIFIED = "UNVERIFIED",
};



export interface ArchiveModelData {
  model_update?: Model_Key | null;
}

export interface ArchiveModelVariables {
  id: string;
}

export interface BrandCategory_Key {
  brandId: string;
  categoryId: string;
  __typename?: 'BrandCategory_Key';
}

export interface Brand_Key {
  id: string;
  __typename?: 'Brand_Key';
}

export interface Category_Key {
  id: string;
  __typename?: 'Category_Key';
}

export interface ConsumableSource_Key {
  consumableId: string;
  sourceId: string;
  __typename?: 'ConsumableSource_Key';
}

export interface Consumable_Key {
  id: string;
  __typename?: 'Consumable_Key';
}

export interface GetModelBySlugData {
  model?: {
    id: string;
    slug: string;
    modelName: string;
    modelCode: string;
    series?: string | null;
    verificationStatus: VerificationStatus;
    releaseYear?: number | null;
    releaseMonth?: number | null;
    releaseDay?: number | null;
    releaseSourceUrl?: string | null;
    category: {
      id: string;
      label: string;
    } & Category_Key;
    brand: {
      id: string;
      slug: string;
      name: string;
      nameEn?: string | null;
    } & Brand_Key;
    aliases: ({
      alias: string;
    })[];
    images: ({
      id: string;
      url: string;
      alt: string;
      sourceUrl: string;
      isPrimary: boolean;
    } & ModelImage_Key)[];
    consumables: ({
      id: string;
      slug: string;
      type: string;
      displayName: string;
      genuinePartNumber?: string | null;
      partNumberStatus: PartNumberStatus;
      replacementInterval?: string | null;
      verificationStatus: VerificationStatus;
    } & Consumable_Key)[];
  } & Model_Key;
}

export interface GetModelBySlugVariables {
  slug: string;
}

export interface ListBrandsData {
  brands: ({
    id: string;
    slug: string;
    name: string;
    nameEn?: string | null;
    officialDomains?: string[] | null;
    categories: ({
      id: string;
      label: string;
    } & Category_Key)[];
  } & Brand_Key)[];
}

export interface ListCategoriesData {
  categories: ({
    id: string;
    label: string;
    description?: string | null;
    modelNumberGuide?: string | null;
  } & Category_Key)[];
}

export interface ListModelsByBrandData {
  models: ({
    id: string;
    slug: string;
    modelName: string;
    modelCode: string;
    series?: string | null;
    releaseYear?: number | null;
    releaseMonth?: number | null;
    releaseDay?: number | null;
    category: {
      id: string;
      label: string;
    } & Category_Key;
    images: ({
      url: string;
      alt: string;
    })[];
  } & Model_Key)[];
}

export interface ListModelsByBrandVariables {
  brandId: string;
  limit?: number | null;
  offset?: number | null;
}

export interface ListModelsByCategoryData {
  models: ({
    id: string;
    slug: string;
    modelName: string;
    modelCode: string;
    series?: string | null;
    releaseYear?: number | null;
    releaseMonth?: number | null;
    releaseDay?: number | null;
    brand: {
      id: string;
      slug: string;
      name: string;
      nameEn?: string | null;
    } & Brand_Key;
    images: ({
      url: string;
      alt: string;
    })[];
  } & Model_Key)[];
}

export interface ListModelsByCategoryVariables {
  categoryId: string;
  limit?: number | null;
  offset?: number | null;
}

export interface ModelAlias_Key {
  modelId: string;
  aliasNormalized: string;
  __typename?: 'ModelAlias_Key';
}

export interface ModelConsumable_Key {
  modelId: string;
  consumableId: string;
  __typename?: 'ModelConsumable_Key';
}

export interface ModelImage_Key {
  id: string;
  __typename?: 'ModelImage_Key';
}

export interface ModelSource_Key {
  modelId: string;
  sourceId: string;
  __typename?: 'ModelSource_Key';
}

export interface Model_Key {
  id: string;
  __typename?: 'Model_Key';
}

export interface ProductOptionSource_Key {
  productOptionId: string;
  sourceId: string;
  __typename?: 'ProductOptionSource_Key';
}

export interface ProductOption_Key {
  id: string;
  __typename?: 'ProductOption_Key';
}

export interface PurchaseLink_Key {
  id: string;
  __typename?: 'PurchaseLink_Key';
}

export interface SearchModelsData {
  models_search: ({
    id: string;
    slug: string;
    modelName: string;
    modelCode: string;
    series?: string | null;
    status: PublishStatus;
    category: {
      id: string;
      label: string;
    } & Category_Key;
    brand: {
      id: string;
      slug: string;
      name: string;
      nameEn?: string | null;
    } & Brand_Key;
  } & Model_Key)[];
}

export interface SearchModelsVariables {
  query: string;
  limit?: number | null;
}

export interface Source_Key {
  id: string;
  __typename?: 'Source_Key';
}

export interface UpsertBrandData {
  brand_upsert: Brand_Key;
}

export interface UpsertBrandVariables {
  id: string;
  slug: string;
  name: string;
  nameEn?: string | null;
  officialDomains: string[];
  sortOrder: number;
}

export interface UpsertCategoryData {
  category_upsert: Category_Key;
}

export interface UpsertCategoryVariables {
  id: string;
  label: string;
  description?: string | null;
  modelNumberGuide?: string | null;
  sortOrder: number;
}

export interface UpsertModelData {
  model_upsert: Model_Key;
}

export interface UpsertModelVariables {
  id: string;
  slug: string;
  categoryId: string;
  brandId: string;
  modelName: string;
  modelCode: string;
  modelCodeNormalized: string;
  series?: string | null;
  status: PublishStatus;
  verificationStatus: VerificationStatus;
  releaseYear?: number | null;
  releaseMonth?: number | null;
  releaseDay?: number | null;
  releaseSourceUrl?: string | null;
}

interface UpsertCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
  operationName: string;
}
export const upsertCategoryRef: UpsertCategoryRef;

export function upsertCategory(vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;
export function upsertCategory(dc: DataConnect, vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;

interface UpsertBrandRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertBrandVariables): MutationRef<UpsertBrandData, UpsertBrandVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertBrandVariables): MutationRef<UpsertBrandData, UpsertBrandVariables>;
  operationName: string;
}
export const upsertBrandRef: UpsertBrandRef;

export function upsertBrand(vars: UpsertBrandVariables): MutationPromise<UpsertBrandData, UpsertBrandVariables>;
export function upsertBrand(dc: DataConnect, vars: UpsertBrandVariables): MutationPromise<UpsertBrandData, UpsertBrandVariables>;

interface UpsertModelRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertModelVariables): MutationRef<UpsertModelData, UpsertModelVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertModelVariables): MutationRef<UpsertModelData, UpsertModelVariables>;
  operationName: string;
}
export const upsertModelRef: UpsertModelRef;

export function upsertModel(vars: UpsertModelVariables): MutationPromise<UpsertModelData, UpsertModelVariables>;
export function upsertModel(dc: DataConnect, vars: UpsertModelVariables): MutationPromise<UpsertModelData, UpsertModelVariables>;

interface ArchiveModelRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchiveModelVariables): MutationRef<ArchiveModelData, ArchiveModelVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ArchiveModelVariables): MutationRef<ArchiveModelData, ArchiveModelVariables>;
  operationName: string;
}
export const archiveModelRef: ArchiveModelRef;

export function archiveModel(vars: ArchiveModelVariables): MutationPromise<ArchiveModelData, ArchiveModelVariables>;
export function archiveModel(dc: DataConnect, vars: ArchiveModelVariables): MutationPromise<ArchiveModelData, ArchiveModelVariables>;

interface ListCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCategoriesData, undefined>;
  operationName: string;
}
export const listCategoriesRef: ListCategoriesRef;

export function listCategories(options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;
export function listCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface ListBrandsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBrandsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBrandsData, undefined>;
  operationName: string;
}
export const listBrandsRef: ListBrandsRef;

export function listBrands(options?: ExecuteQueryOptions): QueryPromise<ListBrandsData, undefined>;
export function listBrands(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBrandsData, undefined>;

interface GetModelBySlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetModelBySlugVariables): QueryRef<GetModelBySlugData, GetModelBySlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetModelBySlugVariables): QueryRef<GetModelBySlugData, GetModelBySlugVariables>;
  operationName: string;
}
export const getModelBySlugRef: GetModelBySlugRef;

export function getModelBySlug(vars: GetModelBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetModelBySlugData, GetModelBySlugVariables>;
export function getModelBySlug(dc: DataConnect, vars: GetModelBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetModelBySlugData, GetModelBySlugVariables>;

interface ListModelsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListModelsByCategoryVariables): QueryRef<ListModelsByCategoryData, ListModelsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListModelsByCategoryVariables): QueryRef<ListModelsByCategoryData, ListModelsByCategoryVariables>;
  operationName: string;
}
export const listModelsByCategoryRef: ListModelsByCategoryRef;

export function listModelsByCategory(vars: ListModelsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByCategoryData, ListModelsByCategoryVariables>;
export function listModelsByCategory(dc: DataConnect, vars: ListModelsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByCategoryData, ListModelsByCategoryVariables>;

interface ListModelsByBrandRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListModelsByBrandVariables): QueryRef<ListModelsByBrandData, ListModelsByBrandVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListModelsByBrandVariables): QueryRef<ListModelsByBrandData, ListModelsByBrandVariables>;
  operationName: string;
}
export const listModelsByBrandRef: ListModelsByBrandRef;

export function listModelsByBrand(vars: ListModelsByBrandVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByBrandData, ListModelsByBrandVariables>;
export function listModelsByBrand(dc: DataConnect, vars: ListModelsByBrandVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByBrandData, ListModelsByBrandVariables>;

interface SearchModelsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchModelsVariables): QueryRef<SearchModelsData, SearchModelsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchModelsVariables): QueryRef<SearchModelsData, SearchModelsVariables>;
  operationName: string;
}
export const searchModelsRef: SearchModelsRef;

export function searchModels(vars: SearchModelsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchModelsData, SearchModelsVariables>;
export function searchModels(dc: DataConnect, vars: SearchModelsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchModelsData, SearchModelsVariables>;
