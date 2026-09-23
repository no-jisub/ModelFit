const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const PublishStatus = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
}
exports.PublishStatus = PublishStatus;

const SourceType = {
  MANUFACTURER: "MANUFACTURER",
  OFFICIAL_MANUAL: "OFFICIAL_MANUAL",
  OFFICIAL_STORE: "OFFICIAL_STORE",
  SELLER: "SELLER",
  OTHER: "OTHER",
}
exports.SourceType = SourceType;

const VerificationStatus = {
  OFFICIAL: "OFFICIAL",
  SELLER_CONFIRMED: "SELLER_CONFIRMED",
  USER_REPORTED: "USER_REPORTED",
  UNVERIFIED: "UNVERIFIED",
}
exports.VerificationStatus = VerificationStatus;

const connectorConfig = {
  connector: 'catalog',
  service: 'modelfit-catalog',
  location: 'asia-northeast3'
};
exports.connectorConfig = connectorConfig;

const upsertCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCategory', inputVars);
}
upsertCategoryRef.operationName = 'UpsertCategory';
exports.upsertCategoryRef = upsertCategoryRef;

exports.upsertCategory = function upsertCategory(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCategoryRef(dcInstance, inputVars));
}
;

const upsertBrandRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertBrand', inputVars);
}
upsertBrandRef.operationName = 'UpsertBrand';
exports.upsertBrandRef = upsertBrandRef;

exports.upsertBrand = function upsertBrand(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertBrandRef(dcInstance, inputVars));
}
;

const upsertModelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertModel', inputVars);
}
upsertModelRef.operationName = 'UpsertModel';
exports.upsertModelRef = upsertModelRef;

exports.upsertModel = function upsertModel(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertModelRef(dcInstance, inputVars));
}
;

const archiveModelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ArchiveModel', inputVars);
}
archiveModelRef.operationName = 'ArchiveModel';
exports.archiveModelRef = archiveModelRef;

exports.archiveModel = function archiveModel(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(archiveModelRef(dcInstance, inputVars));
}
;

const listCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCategories');
}
listCategoriesRef.operationName = 'ListCategories';
exports.listCategoriesRef = listCategoriesRef;

exports.listCategories = function listCategories(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCategoriesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listBrandsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBrands');
}
listBrandsRef.operationName = 'ListBrands';
exports.listBrandsRef = listBrandsRef;

exports.listBrands = function listBrands(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listBrandsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getModelBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetModelBySlug', inputVars);
}
getModelBySlugRef.operationName = 'GetModelBySlug';
exports.getModelBySlugRef = getModelBySlugRef;

exports.getModelBySlug = function getModelBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getModelBySlugRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listModelsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListModelsByCategory', inputVars);
}
listModelsByCategoryRef.operationName = 'ListModelsByCategory';
exports.listModelsByCategoryRef = listModelsByCategoryRef;

exports.listModelsByCategory = function listModelsByCategory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listModelsByCategoryRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listModelsByBrandRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListModelsByBrand', inputVars);
}
listModelsByBrandRef.operationName = 'ListModelsByBrand';
exports.listModelsByBrandRef = listModelsByBrandRef;

exports.listModelsByBrand = function listModelsByBrand(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listModelsByBrandRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const searchModelsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchModels', inputVars);
}
searchModelsRef.operationName = 'SearchModels';
exports.searchModelsRef = searchModelsRef;

exports.searchModels = function searchModels(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchModelsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
