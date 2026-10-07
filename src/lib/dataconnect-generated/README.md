# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `catalog`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListCategories*](#listcategories)
  - [*ListBrands*](#listbrands)
  - [*GetModelBySlug*](#getmodelbyslug)
  - [*ListModelsByCategory*](#listmodelsbycategory)
  - [*ListModelsByBrand*](#listmodelsbybrand)
  - [*SearchModels*](#searchmodels)
- [**Mutations**](#mutations)
  - [*UpsertCategory*](#upsertcategory)
  - [*UpsertBrand*](#upsertbrand)
  - [*UpsertModel*](#upsertmodel)
  - [*ArchiveModel*](#archivemodel)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `catalog`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@modelfit/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@modelfit/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@modelfit/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `catalog` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListCategories
You can execute the `ListCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCategories(options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface ListCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCategoriesData, undefined>;
}
export const listCategoriesRef: ListCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface ListCategoriesRef {
  ...
  (dc: DataConnect): QueryRef<ListCategoriesData, undefined>;
}
export const listCategoriesRef: ListCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCategoriesRef:
```typescript
const name = listCategoriesRef.operationName;
console.log(name);
```

### Variables
The `ListCategories` query has no variables.
### Return Type
Recall that executing the `ListCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCategoriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCategoriesData {
  categories: ({
    id: string;
    label: string;
    description?: string | null;
    modelNumberGuide?: string | null;
  } & Category_Key)[];
}
```
### Using `ListCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCategories } from '@modelfit/dataconnect';


// Call the `listCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCategories(dataConnect);

console.log(data.categories);

// Or, you can use the `Promise` API.
listCategories().then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

### Using `ListCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCategoriesRef } from '@modelfit/dataconnect';


// Call the `listCategoriesRef()` function to get a reference to the query.
const ref = listCategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCategoriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.categories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

## ListBrands
You can execute the `ListBrands` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listBrands(options?: ExecuteQueryOptions): QueryPromise<ListBrandsData, undefined>;

interface ListBrandsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBrandsData, undefined>;
}
export const listBrandsRef: ListBrandsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBrands(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBrandsData, undefined>;

interface ListBrandsRef {
  ...
  (dc: DataConnect): QueryRef<ListBrandsData, undefined>;
}
export const listBrandsRef: ListBrandsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBrandsRef:
```typescript
const name = listBrandsRef.operationName;
console.log(name);
```

### Variables
The `ListBrands` query has no variables.
### Return Type
Recall that executing the `ListBrands` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBrandsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListBrands`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBrands } from '@modelfit/dataconnect';


// Call the `listBrands()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBrands();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBrands(dataConnect);

console.log(data.brands);

// Or, you can use the `Promise` API.
listBrands().then((response) => {
  const data = response.data;
  console.log(data.brands);
});
```

### Using `ListBrands`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBrandsRef } from '@modelfit/dataconnect';


// Call the `listBrandsRef()` function to get a reference to the query.
const ref = listBrandsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBrandsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.brands);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.brands);
});
```

## GetModelBySlug
You can execute the `GetModelBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getModelBySlug(vars: GetModelBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetModelBySlugData, GetModelBySlugVariables>;

interface GetModelBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetModelBySlugVariables): QueryRef<GetModelBySlugData, GetModelBySlugVariables>;
}
export const getModelBySlugRef: GetModelBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getModelBySlug(dc: DataConnect, vars: GetModelBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetModelBySlugData, GetModelBySlugVariables>;

interface GetModelBySlugRef {
  ...
  (dc: DataConnect, vars: GetModelBySlugVariables): QueryRef<GetModelBySlugData, GetModelBySlugVariables>;
}
export const getModelBySlugRef: GetModelBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getModelBySlugRef:
```typescript
const name = getModelBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetModelBySlug` query requires an argument of type `GetModelBySlugVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetModelBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetModelBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetModelBySlugData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetModelBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getModelBySlug, GetModelBySlugVariables } from '@modelfit/dataconnect';

// The `GetModelBySlug` query requires an argument of type `GetModelBySlugVariables`:
const getModelBySlugVars: GetModelBySlugVariables = {
  slug: ..., 
};

// Call the `getModelBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getModelBySlug(getModelBySlugVars);
// Variables can be defined inline as well.
const { data } = await getModelBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getModelBySlug(dataConnect, getModelBySlugVars);

console.log(data.model);

// Or, you can use the `Promise` API.
getModelBySlug(getModelBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.model);
});
```

### Using `GetModelBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getModelBySlugRef, GetModelBySlugVariables } from '@modelfit/dataconnect';

// The `GetModelBySlug` query requires an argument of type `GetModelBySlugVariables`:
const getModelBySlugVars: GetModelBySlugVariables = {
  slug: ..., 
};

// Call the `getModelBySlugRef()` function to get a reference to the query.
const ref = getModelBySlugRef(getModelBySlugVars);
// Variables can be defined inline as well.
const ref = getModelBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getModelBySlugRef(dataConnect, getModelBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.model);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.model);
});
```

## ListModelsByCategory
You can execute the `ListModelsByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listModelsByCategory(vars: ListModelsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByCategoryData, ListModelsByCategoryVariables>;

interface ListModelsByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListModelsByCategoryVariables): QueryRef<ListModelsByCategoryData, ListModelsByCategoryVariables>;
}
export const listModelsByCategoryRef: ListModelsByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listModelsByCategory(dc: DataConnect, vars: ListModelsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByCategoryData, ListModelsByCategoryVariables>;

interface ListModelsByCategoryRef {
  ...
  (dc: DataConnect, vars: ListModelsByCategoryVariables): QueryRef<ListModelsByCategoryData, ListModelsByCategoryVariables>;
}
export const listModelsByCategoryRef: ListModelsByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listModelsByCategoryRef:
```typescript
const name = listModelsByCategoryRef.operationName;
console.log(name);
```

### Variables
The `ListModelsByCategory` query requires an argument of type `ListModelsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListModelsByCategoryVariables {
  categoryId: string;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `ListModelsByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListModelsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListModelsByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listModelsByCategory, ListModelsByCategoryVariables } from '@modelfit/dataconnect';

// The `ListModelsByCategory` query requires an argument of type `ListModelsByCategoryVariables`:
const listModelsByCategoryVars: ListModelsByCategoryVariables = {
  categoryId: ..., 
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listModelsByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listModelsByCategory(listModelsByCategoryVars);
// Variables can be defined inline as well.
const { data } = await listModelsByCategory({ categoryId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listModelsByCategory(dataConnect, listModelsByCategoryVars);

console.log(data.models);

// Or, you can use the `Promise` API.
listModelsByCategory(listModelsByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.models);
});
```

### Using `ListModelsByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listModelsByCategoryRef, ListModelsByCategoryVariables } from '@modelfit/dataconnect';

// The `ListModelsByCategory` query requires an argument of type `ListModelsByCategoryVariables`:
const listModelsByCategoryVars: ListModelsByCategoryVariables = {
  categoryId: ..., 
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listModelsByCategoryRef()` function to get a reference to the query.
const ref = listModelsByCategoryRef(listModelsByCategoryVars);
// Variables can be defined inline as well.
const ref = listModelsByCategoryRef({ categoryId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listModelsByCategoryRef(dataConnect, listModelsByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.models);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.models);
});
```

## ListModelsByBrand
You can execute the `ListModelsByBrand` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listModelsByBrand(vars: ListModelsByBrandVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByBrandData, ListModelsByBrandVariables>;

interface ListModelsByBrandRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListModelsByBrandVariables): QueryRef<ListModelsByBrandData, ListModelsByBrandVariables>;
}
export const listModelsByBrandRef: ListModelsByBrandRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listModelsByBrand(dc: DataConnect, vars: ListModelsByBrandVariables, options?: ExecuteQueryOptions): QueryPromise<ListModelsByBrandData, ListModelsByBrandVariables>;

interface ListModelsByBrandRef {
  ...
  (dc: DataConnect, vars: ListModelsByBrandVariables): QueryRef<ListModelsByBrandData, ListModelsByBrandVariables>;
}
export const listModelsByBrandRef: ListModelsByBrandRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listModelsByBrandRef:
```typescript
const name = listModelsByBrandRef.operationName;
console.log(name);
```

### Variables
The `ListModelsByBrand` query requires an argument of type `ListModelsByBrandVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListModelsByBrandVariables {
  brandId: string;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `ListModelsByBrand` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListModelsByBrandData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListModelsByBrand`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listModelsByBrand, ListModelsByBrandVariables } from '@modelfit/dataconnect';

// The `ListModelsByBrand` query requires an argument of type `ListModelsByBrandVariables`:
const listModelsByBrandVars: ListModelsByBrandVariables = {
  brandId: ..., 
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listModelsByBrand()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listModelsByBrand(listModelsByBrandVars);
// Variables can be defined inline as well.
const { data } = await listModelsByBrand({ brandId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listModelsByBrand(dataConnect, listModelsByBrandVars);

console.log(data.models);

// Or, you can use the `Promise` API.
listModelsByBrand(listModelsByBrandVars).then((response) => {
  const data = response.data;
  console.log(data.models);
});
```

### Using `ListModelsByBrand`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listModelsByBrandRef, ListModelsByBrandVariables } from '@modelfit/dataconnect';

// The `ListModelsByBrand` query requires an argument of type `ListModelsByBrandVariables`:
const listModelsByBrandVars: ListModelsByBrandVariables = {
  brandId: ..., 
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listModelsByBrandRef()` function to get a reference to the query.
const ref = listModelsByBrandRef(listModelsByBrandVars);
// Variables can be defined inline as well.
const ref = listModelsByBrandRef({ brandId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listModelsByBrandRef(dataConnect, listModelsByBrandVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.models);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.models);
});
```

## SearchModels
You can execute the `SearchModels` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchModels(vars: SearchModelsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchModelsData, SearchModelsVariables>;

interface SearchModelsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchModelsVariables): QueryRef<SearchModelsData, SearchModelsVariables>;
}
export const searchModelsRef: SearchModelsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchModels(dc: DataConnect, vars: SearchModelsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchModelsData, SearchModelsVariables>;

interface SearchModelsRef {
  ...
  (dc: DataConnect, vars: SearchModelsVariables): QueryRef<SearchModelsData, SearchModelsVariables>;
}
export const searchModelsRef: SearchModelsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchModelsRef:
```typescript
const name = searchModelsRef.operationName;
console.log(name);
```

### Variables
The `SearchModels` query requires an argument of type `SearchModelsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchModelsVariables {
  query: string;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `SearchModels` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchModelsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `SearchModels`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchModels, SearchModelsVariables } from '@modelfit/dataconnect';

// The `SearchModels` query requires an argument of type `SearchModelsVariables`:
const searchModelsVars: SearchModelsVariables = {
  query: ..., 
  limit: ..., // optional
};

// Call the `searchModels()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchModels(searchModelsVars);
// Variables can be defined inline as well.
const { data } = await searchModels({ query: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchModels(dataConnect, searchModelsVars);

console.log(data.models_search);

// Or, you can use the `Promise` API.
searchModels(searchModelsVars).then((response) => {
  const data = response.data;
  console.log(data.models_search);
});
```

### Using `SearchModels`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchModelsRef, SearchModelsVariables } from '@modelfit/dataconnect';

// The `SearchModels` query requires an argument of type `SearchModelsVariables`:
const searchModelsVars: SearchModelsVariables = {
  query: ..., 
  limit: ..., // optional
};

// Call the `searchModelsRef()` function to get a reference to the query.
const ref = searchModelsRef(searchModelsVars);
// Variables can be defined inline as well.
const ref = searchModelsRef({ query: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchModelsRef(dataConnect, searchModelsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.models_search);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.models_search);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `catalog` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertCategory
You can execute the `UpsertCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCategory(vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;

interface UpsertCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
}
export const upsertCategoryRef: UpsertCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCategory(dc: DataConnect, vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;

interface UpsertCategoryRef {
  ...
  (dc: DataConnect, vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
}
export const upsertCategoryRef: UpsertCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCategoryRef:
```typescript
const name = upsertCategoryRef.operationName;
console.log(name);
```

### Variables
The `UpsertCategory` mutation requires an argument of type `UpsertCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCategoryVariables {
  id: string;
  label: string;
  description?: string | null;
  modelNumberGuide?: string | null;
  sortOrder: number;
}
```
### Return Type
Recall that executing the `UpsertCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCategoryData {
  category_upsert: Category_Key;
}
```
### Using `UpsertCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCategory, UpsertCategoryVariables } from '@modelfit/dataconnect';

// The `UpsertCategory` mutation requires an argument of type `UpsertCategoryVariables`:
const upsertCategoryVars: UpsertCategoryVariables = {
  id: ..., 
  label: ..., 
  description: ..., // optional
  modelNumberGuide: ..., // optional
  sortOrder: ..., 
};

// Call the `upsertCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCategory(upsertCategoryVars);
// Variables can be defined inline as well.
const { data } = await upsertCategory({ id: ..., label: ..., description: ..., modelNumberGuide: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCategory(dataConnect, upsertCategoryVars);

console.log(data.category_upsert);

// Or, you can use the `Promise` API.
upsertCategory(upsertCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_upsert);
});
```

### Using `UpsertCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCategoryRef, UpsertCategoryVariables } from '@modelfit/dataconnect';

// The `UpsertCategory` mutation requires an argument of type `UpsertCategoryVariables`:
const upsertCategoryVars: UpsertCategoryVariables = {
  id: ..., 
  label: ..., 
  description: ..., // optional
  modelNumberGuide: ..., // optional
  sortOrder: ..., 
};

// Call the `upsertCategoryRef()` function to get a reference to the mutation.
const ref = upsertCategoryRef(upsertCategoryVars);
// Variables can be defined inline as well.
const ref = upsertCategoryRef({ id: ..., label: ..., description: ..., modelNumberGuide: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCategoryRef(dataConnect, upsertCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_upsert);
});
```

## UpsertBrand
You can execute the `UpsertBrand` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertBrand(vars: UpsertBrandVariables): MutationPromise<UpsertBrandData, UpsertBrandVariables>;

interface UpsertBrandRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertBrandVariables): MutationRef<UpsertBrandData, UpsertBrandVariables>;
}
export const upsertBrandRef: UpsertBrandRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertBrand(dc: DataConnect, vars: UpsertBrandVariables): MutationPromise<UpsertBrandData, UpsertBrandVariables>;

interface UpsertBrandRef {
  ...
  (dc: DataConnect, vars: UpsertBrandVariables): MutationRef<UpsertBrandData, UpsertBrandVariables>;
}
export const upsertBrandRef: UpsertBrandRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertBrandRef:
```typescript
const name = upsertBrandRef.operationName;
console.log(name);
```

### Variables
The `UpsertBrand` mutation requires an argument of type `UpsertBrandVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertBrandVariables {
  id: string;
  slug: string;
  name: string;
  nameEn?: string | null;
  officialDomains: string[];
  sortOrder: number;
}
```
### Return Type
Recall that executing the `UpsertBrand` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertBrandData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertBrandData {
  brand_upsert: Brand_Key;
}
```
### Using `UpsertBrand`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertBrand, UpsertBrandVariables } from '@modelfit/dataconnect';

// The `UpsertBrand` mutation requires an argument of type `UpsertBrandVariables`:
const upsertBrandVars: UpsertBrandVariables = {
  id: ..., 
  slug: ..., 
  name: ..., 
  nameEn: ..., // optional
  officialDomains: ..., 
  sortOrder: ..., 
};

// Call the `upsertBrand()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertBrand(upsertBrandVars);
// Variables can be defined inline as well.
const { data } = await upsertBrand({ id: ..., slug: ..., name: ..., nameEn: ..., officialDomains: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertBrand(dataConnect, upsertBrandVars);

console.log(data.brand_upsert);

// Or, you can use the `Promise` API.
upsertBrand(upsertBrandVars).then((response) => {
  const data = response.data;
  console.log(data.brand_upsert);
});
```

### Using `UpsertBrand`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertBrandRef, UpsertBrandVariables } from '@modelfit/dataconnect';

// The `UpsertBrand` mutation requires an argument of type `UpsertBrandVariables`:
const upsertBrandVars: UpsertBrandVariables = {
  id: ..., 
  slug: ..., 
  name: ..., 
  nameEn: ..., // optional
  officialDomains: ..., 
  sortOrder: ..., 
};

// Call the `upsertBrandRef()` function to get a reference to the mutation.
const ref = upsertBrandRef(upsertBrandVars);
// Variables can be defined inline as well.
const ref = upsertBrandRef({ id: ..., slug: ..., name: ..., nameEn: ..., officialDomains: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertBrandRef(dataConnect, upsertBrandVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.brand_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.brand_upsert);
});
```

## UpsertModel
You can execute the `UpsertModel` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertModel(vars: UpsertModelVariables): MutationPromise<UpsertModelData, UpsertModelVariables>;

interface UpsertModelRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertModelVariables): MutationRef<UpsertModelData, UpsertModelVariables>;
}
export const upsertModelRef: UpsertModelRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertModel(dc: DataConnect, vars: UpsertModelVariables): MutationPromise<UpsertModelData, UpsertModelVariables>;

interface UpsertModelRef {
  ...
  (dc: DataConnect, vars: UpsertModelVariables): MutationRef<UpsertModelData, UpsertModelVariables>;
}
export const upsertModelRef: UpsertModelRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertModelRef:
```typescript
const name = upsertModelRef.operationName;
console.log(name);
```

### Variables
The `UpsertModel` mutation requires an argument of type `UpsertModelVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertModel` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertModelData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertModelData {
  model_upsert: Model_Key;
}
```
### Using `UpsertModel`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertModel, UpsertModelVariables } from '@modelfit/dataconnect';

// The `UpsertModel` mutation requires an argument of type `UpsertModelVariables`:
const upsertModelVars: UpsertModelVariables = {
  id: ..., 
  slug: ..., 
  categoryId: ..., 
  brandId: ..., 
  modelName: ..., 
  modelCode: ..., 
  modelCodeNormalized: ..., 
  series: ..., // optional
  status: ..., 
  verificationStatus: ..., 
  releaseYear: ..., // optional
  releaseMonth: ..., // optional
  releaseDay: ..., // optional
  releaseSourceUrl: ..., // optional
};

// Call the `upsertModel()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertModel(upsertModelVars);
// Variables can be defined inline as well.
const { data } = await upsertModel({ id: ..., slug: ..., categoryId: ..., brandId: ..., modelName: ..., modelCode: ..., modelCodeNormalized: ..., series: ..., status: ..., verificationStatus: ..., releaseYear: ..., releaseMonth: ..., releaseDay: ..., releaseSourceUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertModel(dataConnect, upsertModelVars);

console.log(data.model_upsert);

// Or, you can use the `Promise` API.
upsertModel(upsertModelVars).then((response) => {
  const data = response.data;
  console.log(data.model_upsert);
});
```

### Using `UpsertModel`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertModelRef, UpsertModelVariables } from '@modelfit/dataconnect';

// The `UpsertModel` mutation requires an argument of type `UpsertModelVariables`:
const upsertModelVars: UpsertModelVariables = {
  id: ..., 
  slug: ..., 
  categoryId: ..., 
  brandId: ..., 
  modelName: ..., 
  modelCode: ..., 
  modelCodeNormalized: ..., 
  series: ..., // optional
  status: ..., 
  verificationStatus: ..., 
  releaseYear: ..., // optional
  releaseMonth: ..., // optional
  releaseDay: ..., // optional
  releaseSourceUrl: ..., // optional
};

// Call the `upsertModelRef()` function to get a reference to the mutation.
const ref = upsertModelRef(upsertModelVars);
// Variables can be defined inline as well.
const ref = upsertModelRef({ id: ..., slug: ..., categoryId: ..., brandId: ..., modelName: ..., modelCode: ..., modelCodeNormalized: ..., series: ..., status: ..., verificationStatus: ..., releaseYear: ..., releaseMonth: ..., releaseDay: ..., releaseSourceUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertModelRef(dataConnect, upsertModelVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.model_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.model_upsert);
});
```

## ArchiveModel
You can execute the `ArchiveModel` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
archiveModel(vars: ArchiveModelVariables): MutationPromise<ArchiveModelData, ArchiveModelVariables>;

interface ArchiveModelRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchiveModelVariables): MutationRef<ArchiveModelData, ArchiveModelVariables>;
}
export const archiveModelRef: ArchiveModelRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
archiveModel(dc: DataConnect, vars: ArchiveModelVariables): MutationPromise<ArchiveModelData, ArchiveModelVariables>;

interface ArchiveModelRef {
  ...
  (dc: DataConnect, vars: ArchiveModelVariables): MutationRef<ArchiveModelData, ArchiveModelVariables>;
}
export const archiveModelRef: ArchiveModelRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the archiveModelRef:
```typescript
const name = archiveModelRef.operationName;
console.log(name);
```

### Variables
The `ArchiveModel` mutation requires an argument of type `ArchiveModelVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ArchiveModelVariables {
  id: string;
}
```
### Return Type
Recall that executing the `ArchiveModel` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ArchiveModelData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ArchiveModelData {
  model_update?: Model_Key | null;
}
```
### Using `ArchiveModel`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, archiveModel, ArchiveModelVariables } from '@modelfit/dataconnect';

// The `ArchiveModel` mutation requires an argument of type `ArchiveModelVariables`:
const archiveModelVars: ArchiveModelVariables = {
  id: ..., 
};

// Call the `archiveModel()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await archiveModel(archiveModelVars);
// Variables can be defined inline as well.
const { data } = await archiveModel({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await archiveModel(dataConnect, archiveModelVars);

console.log(data.model_update);

// Or, you can use the `Promise` API.
archiveModel(archiveModelVars).then((response) => {
  const data = response.data;
  console.log(data.model_update);
});
```

### Using `ArchiveModel`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, archiveModelRef, ArchiveModelVariables } from '@modelfit/dataconnect';

// The `ArchiveModel` mutation requires an argument of type `ArchiveModelVariables`:
const archiveModelVars: ArchiveModelVariables = {
  id: ..., 
};

// Call the `archiveModelRef()` function to get a reference to the mutation.
const ref = archiveModelRef(archiveModelVars);
// Variables can be defined inline as well.
const ref = archiveModelRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = archiveModelRef(dataConnect, archiveModelVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.model_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.model_update);
});
```
