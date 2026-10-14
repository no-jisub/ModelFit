import { expect, test } from "@playwright/test";

test("코웨이 판매자 전용 모델과 입체필터 내부 구성 수량을 구분한다", async ({ page }) => {
  for (const [model, quantity] of [
    ["ap-1521b", "1세트"],
    ["ap-2021a", "1세트"],
    ["ap-4025d", "2세트"],
  ]) {
    await page.goto("/model/coway/" + model + "#compatible-parts");
    const part = page.locator("#coway-4d-dimensional-filter");
    await expect(
      part
        .locator(".purchase-quantity-summary > div")
        .filter({ hasText: "제품 1대 필요 수량" })
        .locator("dd"),
    ).toContainText(quantity);
    await expect(part).toContainText("내부 구성 수량과 구분");
    await expect(
      part.getByRole("heading", { name: "코웨이 노블 AP-1521B 4D 항균 호환 필터", exact: true }),
    ).toHaveCount(model === "ap-1521b" ? 1 : 0);
  }
});

test("유피 C20·C28 해외직구 호환상품은 선택된 부품과 판매 수량을 표시한다", async ({ page }) => {
  for (const [model, entries] of [
    [
      "c20",
      [
        ["side-brush", "사이드 브러시 6개"],
        ["roller-brush", "롤러 브러시 1개"],
        ["dust-bag", "먼지봉투 6개"],
      ],
    ],
    [
      "c28",
      [
        ["side-brush", "사이드 브러시 6개"],
        ["dust-bag", "먼지봉투 12개"],
      ],
    ],
  ] as const) {
    await page.goto("/model/eufy/omni-" + model + "#compatible-parts");
    for (const [suffix, pack] of entries) {
      const option = page
        .locator("#eufy-" + model + "-" + suffix + " .product-option-card")
        .filter({ hasText: pack });
      await expect(option).toContainText("판매자 호환 표기");
      await expect(option.getByRole("link", { name: /쿠팡 해외직구 상품 보기/ })).toBeVisible();
    }
  }
});

test("같은 품번의 샤오미 사이드 브러시와 로보락 먼지봉투를 모델별로 제한한다", async ({ page }) => {
  for (const model of ["x10-plus", "x20-plus"]) {
    await page.goto("/model/xiaomi/" + model + "#compatible-parts");
    const part = page.locator("#xiaomi-" + model + "-side-brush");
    await expect(part).toContainText("B101CN-BS");
    await expect(
      part
        .locator(".purchase-quantity-summary > div")
        .filter({ hasText: "제품 1대 필요 수량" })
        .locator("dd"),
    ).toContainText("1개");
    await expect(part).toContainText("사이드 브러시 2개");
    await expect(part.getByRole("link", { name: /공식몰 사이드 브러시 구매하기/ })).toBeVisible();
  }
  for (const [model, count] of [
    ["s8-maxv-ultra", 1],
    ["qrevo-curv-2-flow", 1],
    ["saros-z70", 0],
  ] as const) {
    await page.goto("/model/roborock/" + model + "#compatible-parts");
    await expect(
      page.getByRole("heading", { name: "로보락 SDCD05RR 먼지봉투 2개입", exact: true }),
    ).toHaveCount(count);
  }
});
