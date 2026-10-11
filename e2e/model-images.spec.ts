import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { models } from "../src/data/models";

const firebaseConfig = JSON.parse(readFileSync("firebase.json", "utf8")) as {
  hosting: { headers: { headers: { key: string; value: string }[] }[] };
};
const csp = firebaseConfig.hosting.headers
  .flatMap((entry) => entry.headers)
  .find((header) => header.key === "Content-Security-Policy")!.value;

test.beforeEach(async ({ page }) => {
  await page.route("http://127.0.0.1:*/**", async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), "content-security-policy": csp },
    });
  });
});

test("기존 위닉스 사진을 배포 CSP에서도 표시한다", async ({ page }) => {
  const model = models.find((model) => model.id === "winix-aprm833-jwk")!;
  let requested = false;
  await page.route(model.image!.src, async (route) => {
    requested = true;
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720"><rect width="720" height="720" fill="white"/></svg>',
    });
  });
  await page.goto(`/model/${model.brandId}/${model.slug}`);
  const image = page.locator(".model-detail-image img");
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(720);
  await expect(page.locator(".model-detail-image .model-photo-placeholder")).toBeHidden();
  expect(requested).toBe(true);
});

test("쿠팡 이미지 로딩이 실패하면 깨진 이미지 대신 안내를 표시한다", async ({ page }) => {
  const model = models.find((model) =>
    model.image?.src.startsWith("https://ads-partners.coupang.com/"),
  )!;
  await page.route("https://ads-partners.coupang.com/**", (route) => route.abort());
  await page.goto(`/model/${model.brandId}/${model.slug}`);
  await expect(page.locator(".model-detail-image img")).toBeHidden();
  await expect(page.locator(".model-detail-image .model-photo-placeholder")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
