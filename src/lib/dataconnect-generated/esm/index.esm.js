import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const PublishStatus = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
}

export const SourceType = {
  MANUFACTURER: "MANUFACTURER",
  OFFICIAL_MANUAL: "OFFICIAL_MANUAL",
  OFFICIAL_STORE: "OFFICIAL_STORE",
  SELLER: "SELLER",
  OTHER: "OTHER",
}

export const VerificationStatus = {
  OFFICIAL: "OFFICIAL",
  SELLER_CONFIRMED: "SELLER_CONFIRMED",
  USER_REPORTED: "USER_REPORTED",
  UNVERIFIED: "UNVERIFIED",
}

export const connectorConfig = {
  connector: 'catalog',
  service: 'modelfit-catalog',
  location: 'asia-northeast3'
};
export const upsertCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCategory', inputVars);
}
upsertCategoryRef.operationName = 'UpsertCategory';

export function upsertCategory(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCategoryRef(dcInstance, inputVars));
}

export const upsertBrandRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertBrand', inputVars);
}
upsertBrandRef.operationName = 'UpsertBrand';

export function upsertBrand(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertBrandRef(dcInstance, inputVars));
}

export const upsertModelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertModel', inputVars);
}
upsertModelRef.operationName = 'UpsertModel';

export function upsertModel(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertModelRef(dcInstance, inputVars));
}

export const archiveModelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ArchiveModel', inputVars);
}
archiveModelRef.operationName = 'ArchiveModel';

export function archiveModel(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(archiveModelRef(dcInstance, inputVars));
}

export const listCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCategories');
}
listCategoriesRef.operationName = 'ListCategories';

export function listCategories(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCategoriesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listBrandsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBrands');
}
listBrandsRef.operationName = 'ListBrands';

export function listBrands(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listBrandsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getModelBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetModelBySlug', inputVars);
}
getModelBySlugRef.operationName = 'GetModelBySlug';

export function getModelBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getModelBySlugRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listModelsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListModelsByCategory', inputVars);
}
listModelsByCategoryRef.operationName = 'ListModelsByCategory';

export function listModelsByCategory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listModelsByCategoryRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listModelsByBrandRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListModelsByBrand', inputVars);
}
listModelsByBrandRef.operationName = 'ListModelsByBrand';

export function listModelsByBrand(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listModelsByBrandRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const searchModelsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchModels', inputVars);
}
searchModelsRef.operationName = 'SearchModels';

export function searchModels(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchModelsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

