import { expect, test } from "@playwright/test";

test("검색에서 소모품 상세와 비제휴 구매 경로로 이동한다", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "모델명, 상품명 또는 정품 부품번호" })
    .fill("ADQ30041405");
  await page.getByRole("button", { name: "소모품 찾기" }).click();

  await expect(page).toHaveURL(/\/find\?q=ADQ30041405/);
  await expect(page.getByRole("tab", { name: /소모품 1/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("heading", { name: "상품명과 부품번호가 일치합니다" })).toBeVisible();
  await page.getByRole("link", { name: "LG 퓨리탈취청정 M 필터", exact: true }).first().click();

  await expect(page).toHaveURL(/\/part\/lg-puricare-m-filter-adq30041405/);
  await expect(page.getByRole("heading", { name: "LG 퓨리탈취청정 M 필터" })).toBeVisible();
  await expect(page.locator("[data-freshness='current']")).toBeVisible();

  const channels = page.locator(".purchase-channel-label");
  await expect(channels.nth(0)).toContainText("공식 사이트");
  await expect(channels.nth(1)).toContainText("쿠팡");

  const coupangLink = page.locator("a[data-purchase-channel='coupang']");
  await expect(coupangLink).toHaveAttribute("href", /coupang\.com/);
  await expect(coupangLink).not.toHaveAttribute("rel", /sponsored/);
});

test("통합검색 결과를 모델과 소모품 탭으로 전환한다", async ({ page }) => {
  await page.goto("/find?q=필터");

  const modelTab = page.getByRole("tab", { name: /모델/ });
  const partTab = page.getByRole("tab", { name: /소모품/ });
  await expect(partTab).toHaveAttribute("aria-selected", "true");

  await modelTab.click();
  await expect(page).toHaveURL(/type=models/);
  await expect(modelTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: /모델/ })).toBeVisible();
});

test("모델을 내 가전함에 저장하고 다시 확인한다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");
  const saveButton = page.getByRole("button", { name: "내 가전함에 추가" });
  await saveButton.click();
  await expect(page.getByRole("button", { name: "내 가전함에서 빼기" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.goto("/my-appliances");
  await expect(page.getByRole("heading", { name: "퓨리케어 360° 공기청정기" })).toBeVisible();
  await expect(page.getByText("AS355NSNA", { exact: true })).toBeVisible();
  await expect(page.getByText("브라우저에만 저장", { exact: false })).toBeVisible();
});

test("검색 결과가 없을 때 재검색 안내를 제공한다", async ({ page }) => {
  await page.goto("/find?q=존재하지않는모델9999");

  await expect(page.getByRole("heading", { name: "검색 결과를 찾지 못했습니다" })).toBeVisible();
  await expect(
    page.getByText("모델번호, 소모품 상품명 또는 정품 부품번호", { exact: false }),
  ).toBeVisible();
});

test("모델 상세에서 개인정보 없는 오류 제보 화면으로 이동한다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");
  await page.locator("main").getByRole("link", { name: "정보 수정 제보" }).first().click();

  await expect(page).toHaveURL(/\/report\?.*model=AS355NSNA/);
  await expect(page.getByRole("heading", { name: "잘못된 정보를 알려주세요" })).toBeVisible();
  await expect(page.getByLabel("제품명 또는 모델명")).toHaveValue(/AS355NSNA/);
  await expect(page.getByText("개인정보를 수집하지 않습니다.")).toBeVisible();
  await expect(page.getByRole("button", { name: "오류 제보 보내기" })).toBeDisabled();
});

test("관리자 화면은 Firebase 설정 전 접근을 허용하지 않는다", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: "오류 제보 관리" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "관리자 인증 설정을 준비 중입니다" }),
  ).toBeVisible();
  await expect(page.getByText("Firebase 관리자 인증 설정이 필요합니다.")).toBeVisible();
});
