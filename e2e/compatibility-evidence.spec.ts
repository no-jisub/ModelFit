import { expect, test } from "@playwright/test";

test("코웨이 설명서의 필터 구성 확인과 판매자 호환 상품을 구분한다", async ({ page }) => {
  await page.goto("/model/coway/ap-1521b#compatible-parts");
  for (const id of [
    "coway-4d-pre-filter",
    "coway-4d-dimensional-filter",
    "coway-air-matching-filter",
  ]) {
    const part = page.locator("#" + id);
    await expect(part.getByTitle("공식 호환 확인 상태")).toBeVisible();
    await expect(part).toContainText("모델별 필터 규격은 다를 수 있으므로");
    await part.locator(".part-details > summary").click();
    await expect(
      part.locator('a[href="https://www.coway.com/core/product/fmanual/download/116"]').first(),
    ).toBeVisible();
  }
  const option = page.locator(
    "#coway-4d-dimensional-filter .product-options-section .product-verification-badge:not(.sr-only)",
  );
  await expect(option).toHaveText("판매자 호환 표기");
  await page.goto("/model/coway/ap-2021a#compatible-parts");
  const aftermarket = page.locator("#coway-ap2021-compatible-4d-filter");
  await expect(aftermarket.getByTitle("미검증 상태")).toBeVisible();
  await expect(aftermarket.getByTitle("공식 호환 확인 상태")).toHaveCount(0);
});

test("웰스 AN730은 다른 모델의 사양 대신 정확한 모델 출처를 연결한다", async ({ page }) => {
  await page.goto("/model/wells/an730#compatible-parts");
  await expect(page.getByTitle("미검증 상태")).toHaveCount(0);
  const details = page.locator(".part-details > summary");
  for (const summary of await details.all()) await summary.click();
  await expect(
    page
      .locator('a[href="https://m.kyowonwells.com/Product/Detail?grpIdx=1232&productIdx=374"]')
      .first(),
  ).toBeVisible();
});

test("추가 검증한 모델별 부품은 공식 상태를 표시하고 미확인 등급을 주장하지 않는다", async ({
  page,
}) => {
  for (const [model, ids] of [
    ["everybot/q3-turbo-plus", ["everybot-q3-filter", "everybot-q3-main-brush"]],
    ["everybot/q11", ["everybot-q11-filter"]],
    ["everybot/rs350", ["everybot-rs350-microfiber-mop", "everybot-rs350-yarn-mop"]],
    [
      "everybot/ts402m",
      [
        "everybot-three-spin-microfiber-mop",
        "everybot-three-spin-yarn-mop",
        "everybot-three-spin-disposable-sheet",
      ],
    ],
    [
      "ecovacs/deebot-x11",
      ["ecovacs-x11-main-brush", "ecovacs-x11-side-brush", "ecovacs-x11-roller-mop"],
    ],
    ["roborock/saros-z70", ["roborock-saros-z70-filter"]],
    ["winix/amsh993-jsk", ["winix-master-s-all-in-one-filter"]],
  ] as const) {
    await page.goto("/model/" + model + "#compatible-parts");
    for (const id of ids)
      await expect(page.locator("#" + id).getByTitle("공식 호환 확인 상태")).toBeVisible();
    if (model === "everybot/q11")
      await expect(page.locator("#everybot-q11-filter h3")).toHaveText("에브리봇 Q11 먼지통 필터");
    if (model === "winix/amsh993-jsk")
      await expect(page.locator("#winix-master-s-all-in-one-filter")).toContainText(
        "집진필터와 탈취필터를 각각 장착",
      );
  }
});

test("Q9와 추가 검증 모델에 국내 공식 개별 구매 페이지를 연결한다", async ({ page }) => {
  for (const [model, entries] of [
    [
      "q9",
      [
        ["filter", 215],
        ["main-brush", 216],
        ["side-brush", 72],
        ["mop-pad", 214],
        ["dust-bag", 218],
      ],
    ],
    [
      "q3-turbo-plus",
      [
        ["q3-filter", 110],
        ["q3-main-brush", 58],
      ],
    ],
    [
      "rs350",
      [
        ["microfiber-mop", 219],
        ["yarn-mop", 209],
      ],
    ],
    [
      "ts402m",
      [
        ["three-spin-microfiber-mop", 219],
        ["three-spin-yarn-mop", 209],
        ["three-spin-disposable-sheet", 93],
      ],
    ],
  ] as const) {
    await page.goto("/model/everybot/" + model + "#compatible-parts");
    for (const [suffix, num] of entries) {
      const id =
        model === "q3-turbo-plus" || model === "ts402m"
          ? "everybot-" + suffix
          : "everybot-" + model + "-" + suffix;
      const link = page.locator(
        "#" + id + ' a[data-purchase-channel="official"][data-link-status="direct-product"]',
      );
      await expect(link).toHaveAttribute(
        "href",
        "https://everybotmall.com/product/detail.html?product_no=" + num,
      );
      await expect(link).toBeVisible();
    }
  }
});
