# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertCategory, upsertBrand, upsertModel, archiveModel, listCategories, listBrands, getModelBySlug, listModelsByCategory, listModelsByBrand, searchModels } from '@modelfit/dataconnect';


// Operation UpsertCategory:  For variables, look at type UpsertCategoryVars in ../index.d.ts
const { data } = await UpsertCategory(dataConnect, upsertCategoryVars);

// Operation UpsertBrand:  For variables, look at type UpsertBrandVars in ../index.d.ts
const { data } = await UpsertBrand(dataConnect, upsertBrandVars);

// Operation UpsertModel:  For variables, look at type UpsertModelVars in ../index.d.ts
const { data } = await UpsertModel(dataConnect, upsertModelVars);

// Operation ArchiveModel:  For variables, look at type ArchiveModelVars in ../index.d.ts
const { data } = await ArchiveModel(dataConnect, archiveModelVars);

// Operation ListCategories: 
const { data } = await ListCategories(dataConnect);

// Operation ListBrands: 
const { data } = await ListBrands(dataConnect);

// Operation GetModelBySlug:  For variables, look at type GetModelBySlugVars in ../index.d.ts
const { data } = await GetModelBySlug(dataConnect, getModelBySlugVars);

// Operation ListModelsByCategory:  For variables, look at type ListModelsByCategoryVars in ../index.d.ts
const { data } = await ListModelsByCategory(dataConnect, listModelsByCategoryVars);

// Operation ListModelsByBrand:  For variables, look at type ListModelsByBrandVars in ../index.d.ts
const { data } = await ListModelsByBrand(dataConnect, listModelsByBrandVars);

// Operation SearchModels:  For variables, look at type SearchModelsVars in ../index.d.ts
const { data } = await SearchModels(dataConnect, searchModelsVars);


```