import { expect, test } from "@playwright/test";

test("남은 미검증 항목은 확인한 기본 구성과 타사 상품 규격을 구분한다", async ({ page }) => {
  for (const [model, ids] of [
    [
      "dreame/x50s-pro-master",
      [
        "dreame-x50s-main-brush",
        "dreame-x50s-side-brush",
        "dreame-x50s-dust-box-filter",
        "dreame-x50s-mop-pad",
        "dreame-x50s-dust-bag",
      ],
    ],
    [
      "dreame/x50s-pro-ultra",
      [
        "dreame-x50s-main-brush",
        "dreame-x50s-side-brush",
        "dreame-x50s-dust-box-filter",
        "dreame-x50s-mop-pad",
        "dreame-x50s-dust-bag",
      ],
    ],
    ["blueair/cp9i", ["blueair-cp9i-main-filter"]],
    ["roborock/s10-maxv-ultra", ["roborock-s10-maxv-dust-bag"]],
    ["irobot/205-dustcompactor", ["irobot-205-mop-pad"]],
  ] as const) {
    await page.goto("/model/" + model + "#compatible-parts");
    for (const id of ids)
      await expect(page.locator("#" + id).getByTitle("공식 호환 확인 상태")).toBeVisible();
  }
  await page.goto("/model/dreame/x40s-pro-ultra#compatible-parts");
  await expect(page.locator("#dreame-x40s-main-brush").getByTitle("미검증 상태")).toBeVisible();
  await expect(page.locator("#dreame-x40s-main-brush")).toContainText("등록된 설명서가 없습니다");
  await page.goto("/model/coway/ap-2021a#compatible-parts");
  await expect(page.locator("#coway-ap2021-compatible-4d-filter")).toContainText(
    "판매 페이지의 선택 옵션과 호환모델에 AP-2021A",
  );
});

test("샤오미 공식 교체 품번과 판매 수량을 장착 수량과 구분한다", async ({ page }) => {
  for (const model of ["x10-plus", "x20-plus"]) {
    await page.goto("/model/xiaomi/" + model + "#compatible-parts");
    const part = page.locator("#xiaomi-" + model + "-filter");
    await expect(part).toContainText("STLW01ZHM");
    await expect(part).toContainText("판매 구성은 2개입");
    await expect(part.locator('a[data-link-status="direct-product"]')).toHaveCount(0);
    await expect(
      part.locator(
        '.official-store-guidance a[href="https://www.mi.com/kr/product/xiaomi-robot-vacuum-x10-plus-filter/buy/"]',
      ),
    ).toBeVisible();
  }
});

test("핵심 공기청정기 필터에 모델별 공식 근거와 확인한 구매처를 표시한다", async ({ page }) => {
  for (const [model, id, purchase] of [
    [
      "winix/at8e430-mwk",
      "winix-tower-edge-all-in-one-filter",
      "https://www.winix.com/product/1534",
    ],
    [
      "cuckoo/ac-23ah10fnw",
      "cuckoo-ac23-total-care-filter",
      "https://www.cuckoo.co.kr/mall/productView?productNo=9041",
    ],
    [
      "cuckoo/ac-28ahnl20fnw",
      "cuckoo-acf-ahmt10-filter",
      "https://www.cuckoo.co.kr/mall/productView?productNo=9041",
    ],
    [
      "skmagic/acl-131t0",
      "skmagic-acl131-filter",
      "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000059559",
    ],
  ] as const) {
    await page.goto("/model/" + model + "#compatible-parts");
    const part = page.locator("#" + id);
    await expect(part.getByTitle("공식 호환 확인 상태")).toBeVisible();
    const direct = part.locator(
      'a[data-purchase-channel="official"][data-link-status="direct-product"]',
    );
    await expect(direct).toHaveAttribute("href", purchase);
    await expect(direct).toBeVisible();
    if (model === "cuckoo/ac-23ah10fnw") {
      await expect(part).toContainText("ACF-AHMT10");
      await expect(part).toContainText("필터 2개입");
      await expect(
        page
          .getByRole("region", { name: "세트 상품", exact: true })
          .getByText("판매자 호환 표기", { exact: true }),
      ).toBeVisible();
    }
  }
});

test("기본 필터 종류 확인과 판매 상품의 품번 검증을 구분한다", async ({ page }) => {
  for (const [model, id] of [
    ["cuckoo/ac-14l10few", "cuckoo-ac14-total-care-filter"],
    ["skmagic/acl15c1askwh", "skmagic-all-in-one-care-filter"],
    ["skmagic/acl25c1askce", "skmagic-acl25-all-in-one-care-filter"],
    ["skmagic/acl130z0skpn", "skmagic-acl130z-deodorizing-filter"],
    ["skmagic/acl130z0skpn", "skmagic-acl130z-dust-filter"],
  ] as const) {
    await page.goto("/model/" + model + "#compatible-parts");
    const part = page.locator("#" + id);
    await expect(part.getByTitle("공식 호환 확인 상태")).toBeVisible();
    if (model.includes("c1a")) {
      await expect(part.locator("h3")).toContainText("올인원플러스");
      await expect(part).toContainText("프레임 포함 상품");
      await expect(
        part.locator('a[data-purchase-channel="official"][data-link-status="direct-product"]'),
      ).toHaveCount(0);
    }
    if (model.includes("130z")) {
      await expect(part).toContainText("개별 필터 품번은 아닙니다");
      await expect(
        part.locator('a[data-purchase-channel="official"][data-link-status="direct-product"]'),
      ).toHaveCount(0);
    }
  }
});

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
  await expect(aftermarket.getByTitle("판매자 확인 상태")).toBeVisible();
  await expect(aftermarket.getByTitle("공식 호환 확인 상태")).toHaveCount(0);
});

test("판매자 적용 근거와 공식 선택형 필터를 구분하고 잘못 연결된 구매처를 제외한다", async ({
  page,
}) => {
  await page.goto("/model/coway/ap-2021a#compatible-parts");
  const pet = page.locator("#coway-ap2021-pet-air-matching-filter");
  await expect(pet.getByTitle("공식 호환 확인 상태")).toBeVisible();
  await expect(pet).toContainText("펫필터 2개가 필요하다는 의미는 아닙니다");
  await expect(pet.locator('a[data-link-status="direct-product"]')).toHaveCount(0);
  const wrong = page.locator("#coway-ap2021-compatible-complete-filter-set");
  await expect(wrong.getByTitle("미검증 상태")).toBeVisible();
  await expect(wrong).toContainText("AP-1521B·AP-3021D 상단용");
  await expect(page.locator('a[href="https://link.coupang.com/a/haWfjzH7bU"]')).toHaveCount(0);
  for (const model of ["s8-maxv-ultra", "qrevo-curv"]) {
    await page.goto("/model/roborock/" + model + "#compatible-parts");
    const bag = page.locator("#roborock-s8-qrevo-curv-compatible-dust-bag");
    await expect(bag.getByTitle("판매자 확인 상태")).toBeVisible();
    await expect(bag.getByTitle("공식 호환 확인 상태")).toHaveCount(0);
    await expect(bag).toContainText("용 옵션 그룹");
  }
  await page.goto("/model/dreame/x40s-pro-ultra#compatible-parts");
  const bag = page.locator("#dreame-x40s-dust-bag");
  await expect(bag.getByTitle("미검증 상태")).toBeVisible();
  await expect(bag.locator('a[data-link-status="direct-product"]')).toHaveCount(0);
  await expect(bag).toContainText("L40s Pro Ultra 판매 페이지로 연결");
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
