import { connectDataConnectEmulator, getDataConnect, terminate } from "firebase/data-connect";
import { initializeApp } from "firebase/app";
import {
  connectorConfig,
  listBrands,
  listCategories,
  getModelBySlug,
  listModelsByCategory,
} from "@modelfit/dataconnect";

import { loadRawCatalog } from "./lib/catalog-schema";
const raw = await loadRawCatalog();
const emulatorHost = process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST?.replace(/^https?:\/\//, "");
if (!emulatorHost) throw new Error("FIREBASE_DATA_CONNECT_EMULATOR_HOST가 필요합니다.");
const [host, portText] = emulatorHost.split(":");
const port = Number(portText);
if (!host || !Number.isInteger(port)) throw new Error(`잘못된 에뮬레이터 주소: ${emulatorHost}`);

const app = initializeApp({
  projectId: process.env.GCLOUD_PROJECT || "demo-modelfit-sql",
  apiKey: "demo-api-key",
  appId: "1:1234567890:web:modelfit-local",
});
const dataConnect = getDataConnect(app, connectorConfig);
connectDataConnectEmulator(dataConnect, host, port);

const [{ data: categoryData }, { data: brandData }] = await Promise.all([
  listCategories(dataConnect),
  listBrands(dataConnect),
]);
const modelResults = await Promise.all(
  categoryData.categories.map(({ id }) =>
    listModelsByCategory(dataConnect, { categoryId: id, limit: 500, offset: 0 }),
  ),
);
const modelCount = modelResults.reduce((total, result) => total + result.data.models.length, 0);

const expected = {
  categories: raw["categories.csv"].filter((r) => r.isActive === "true").length,
  brands: raw["brands.csv"].filter((r) => r.isActive === "true").length,
  models: raw["models.csv"].filter((r) => r.status === "published").length,
};
const actual = {
  categories: categoryData.categories.length,
  brands: brandData.brands.length,
  models: modelCount,
};
for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
  if (actual[key] !== expected[key]) {
    throw new Error(
      `SQL Connect 조회 개수 불일치: ${key} 예상 ${expected[key]}, 실제 ${actual[key]}`,
    );
  }
}
type Details = {
  id: string;
  compatibilities: Array<{
    id: string;
    verificationStatus: string;
    verifiedAt: string;
    evidenceScope: string;
    requiredQuantity?: string | null;
    consumable: {
      id: string;
      productOptions: Array<{
        id: string;
        purchaseLinks: Array<{ id: string; url: string }>;
        guidanceLinks: Array<{ id: string; url: string }>;
      }>;
    };
  }>;
};
for (const model of raw["models.csv"].filter((r) => r.status === "published")) {
  const result = await getModelBySlug(dataConnect, { slug: model.slug });
  const detail = result.data.model as unknown as Details | null;
  if (!detail || detail.id !== model.id || !Array.isArray(detail.compatibilities))
    throw new Error("Missing v2 model details " + model.id);
  const expectedRelations = raw["model-consumables.csv"].filter((r) => r.modelId === model.id);
  if (detail.compatibilities.length !== expectedRelations.length)
    throw new Error("Compatibility count mismatch " + model.id);
  for (const relation of detail.compatibilities) {
    const source = expectedRelations.find((r) => r.id === relation.id);
    if (
      !source ||
      source.consumableId !== relation.consumable.id ||
      source.verificationStatus.toUpperCase().replaceAll("-", "_") !==
        relation.verificationStatus ||
      source.verifiedAt !== relation.verifiedAt ||
      source.evidenceScope !== relation.evidenceScope ||
      (source.requiredQuantity || null) !== (relation.requiredQuantity || null)
    )
      throw new Error("Compatibility data mismatch " + relation.id);
    for (const option of relation.consumable.productOptions) {
      for (const [file, links] of [
        ["purchase-links.csv", option.purchaseLinks],
        ["guidance-links.csv", option.guidanceLinks],
      ] as const) {
        const expectedLinks = raw[file].filter(
          (l) => l.productOptionId === option.id && l.isActive === "true",
        );
        if (
          links.length !== expectedLinks.length ||
          links.some((l) => !expectedLinks.some((e) => e.id === l.id && e.url === l.url))
        )
          throw new Error("Option link mismatch " + option.id);
      }
    }
  }
}
await terminate(dataConnect);
console.log(
  `SQL Connect 에뮬레이터 조회 통과: 카테고리 ${actual.categories}, 브랜드 ${actual.brands}, 모델 ${actual.models}`,
);
