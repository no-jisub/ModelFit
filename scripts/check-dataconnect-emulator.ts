import { connectDataConnectEmulator, getDataConnect, terminate } from "firebase/data-connect";
import { initializeApp } from "firebase/app";
import {
  connectorConfig,
  listBrands,
  listCategories,
  listModelsByCategory,
} from "@modelfit/dataconnect";

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

const expected = { categories: 2, brands: 16, models: 80 };
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
await terminate(dataConnect);
console.log(
  `SQL Connect 에뮬레이터 조회 통과: 카테고리 ${actual.categories}, 브랜드 ${actual.brands}, 모델 ${actual.models}`,
);
