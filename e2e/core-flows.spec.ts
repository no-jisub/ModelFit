import { expect, test } from "@playwright/test";

test("홈에서 화면 크기에 맞는 쿠팡 배너와 광고 고지를 제공한다", async ({ page }) => {
  await page.goto("/");

  const isMobile = (page.viewportSize()?.width ?? 0) <= 767;
  const banner = page.locator("[data-coupang-category-banner]");
  const expectedHref = isMobile
    ? "https://link.coupang.com/a/glypBvXwVE"
    : "https://link.coupang.com/a/glymSz5RDg";
  const expectedImageId = isMobile ? "1019540" : "1019534";

  await expect(banner).toBeVisible();
  await expect(banner).toHaveAttribute("href", expectedHref);
  await expect(banner).toHaveAttribute("rel", /sponsored/);
  const imageSource = isMobile
    ? banner.locator("source[media='(max-width: 767px)']")
    : banner.locator("img");
  await expect(imageSource).toHaveAttribute(
    isMobile ? "srcset" : "src",
    new RegExp(expectedImageId),
  );
  await expect(page.locator(".coupang-banner-inner .affiliate-disclosure")).toContainText(
    "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.",
  );
});

test("검색에서 소모품의 공식 호환 모델을 펼쳐 모델 상세로 이동한다", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
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
  const partCard = page.locator(".search-part-card").filter({
    hasText: "LG 퓨리탈취청정 M 필터",
  });
  const compatibleModels = partCard.getByText(/공식 호환 모델 2개 보기/);
  await compatibleModels.click();
  await partCard.getByRole("link", { name: "LG AS355NSNA" }).click();

  await expect(page).toHaveURL(/\/model\/lg\/as355nsna#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("기존 소모품 주소는 호환 모델의 소모품 영역으로 이동한다", async ({ page }) => {
  await page.goto("/part/lg-puricare-g-filter-adq30041403");

  await expect(page).toHaveURL(/\/model\/lg\/as355nsah#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
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

test("모델 카드는 호환 소모품 확인 행동 하나를 제공한다", async ({ page }) => {
  await page.goto("/category/air-purifier");

  const modelCard = page.locator(".model-card").filter({ hasText: "노블 공기청정기" }).first();
  await expect(modelCard.getByRole("link", { name: /호환 소모품 확인/ })).toHaveCount(1);
  await expect(modelCard.getByRole("link", { name: /상세 보기/ })).toHaveCount(0);
});

test("묶인 모델 카드는 모델번호 선택 없이 대표 모델로 이동한다", async ({ page }) => {
  await page.goto("/brand/lg");

  const groupCard = page.locator(".model-group-card").first();
  await expect(groupCard.locator("details")).toHaveCount(0);
  await expect(groupCard.getByRole("link", { name: /호환 소모품 확인/ })).toHaveAttribute(
    "href",
    /\/model\/lg\/[^/]+#compatible-parts$/,
  );
});

test("모델 상세에서 같은 제품군의 모델번호를 변경한다", async ({ page }) => {
  await page.goto("/model/lg/as205ngja");

  const selector = page.getByLabel("모델번호 선택");
  await expect(selector.locator("option")).toHaveCount(5);
  await expect(selector).toHaveValue("/model/lg/as205ngja#compatible-parts");
  await selector.selectOption("/model/lg/as355nsna#compatible-parts");

  await expect(page).toHaveURL(/\/model\/lg\/as355nsna#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("소모품 카드는 정품 구매와 제조사 호환 근거 행동만 제공한다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");

  const card = page.locator(".consumable-card").first();
  await expect(card.getByRole("link", { name: /쿠팡에서 정품 구매하기/ })).toHaveCount(1);
  await expect(card.getByRole("link", { name: /제조사 호환 근거 보기/ })).toHaveCount(1);
  await expect(card.getByRole("link", { name: /구매처 확인하기/ })).toHaveCount(0);
  await expect(card.getByRole("link", { name: /호환품 검색/ })).toHaveCount(0);
});

test("모델을 내 가전함에 저장하고 다시 확인한다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");
  const compatibleParts = page.getByRole("heading", { name: /이 모델에 연결된 소모품/ });
  const officialSources = page.locator(".detail-disclosure").filter({
    hasText: "제조사 공식 출처",
  });
  const modelNumberHelp = page.locator(".detail-disclosure").filter({ hasText: "모델번호 확인" });
  await expect(compatibleParts).toBeVisible();
  await expect(officialSources).toBeVisible();
  await expect(modelNumberHelp).toBeVisible();
  await expect(officialSources).not.toHaveAttribute("open", "");
  await expect(modelNumberHelp).not.toHaveAttribute("open", "");
  await officialSources.locator(":scope > summary").click();
  await expect(officialSources.getByRole("heading", { name: "확인 출처" })).toBeVisible();
  await modelNumberHelp.locator(":scope > summary").click();
  await expect(modelNumberHelp.getByRole("link", { name: /모델번호 찾는 방법/ })).toBeVisible();
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
  const reminderPanel = page.locator(".reminder-panel");
  await expect(reminderPanel).not.toHaveAttribute("open", "");
  await reminderPanel.locator(":scope > summary").click();
  await expect(reminderPanel.getByRole("button", { name: "오늘 교체 완료" }).first()).toBeVisible();
  await expect(reminderPanel.getByText("상세 설정").first()).toBeVisible();
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
  await expect(page.locator(".model-primary-actions").getByRole("link")).toHaveCount(0);
  const reportLink = page.locator("main").getByRole("link", { name: "정보 수정 제보하기" });
  await expect(reportLink).toBeVisible();
  await reportLink.click();

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
