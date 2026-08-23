import { expect, test } from "@playwright/test";

test("홈에서 화면 크기에 맞는 쿠팡 배너와 광고 고지를 제공한다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "모델번호로 호환 소모품 찾기" })).toBeVisible();
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

test("홈 브랜드 전체 보기는 추가 브랜드를 이어 붙이고 닫기를 마지막에 둔다", async ({ page }) => {
  await page.goto("/");

  const directory = page.locator(".brand-directory");
  const toggle = directory.locator("summary");
  const featuredCards = page.locator("#brands > .container > .brand-grid > .brand-card");
  const additionalCards = directory.locator(".brand-grid-secondary > .brand-card");

  await toggle.click();
  await expect(directory).toHaveAttribute("open", "");
  await expect(toggle).toContainText("브랜드 목록 닫기");

  const lastFeatured = await featuredCards.last().boundingBox();
  const firstAdditional = await additionalCards.first().boundingBox();
  const lastAdditional = await additionalCards.last().boundingBox();
  const toggleBox = await toggle.boundingBox();
  const expectedGap = (page.viewportSize()?.width ?? 0) <= 700 ? 12 : 16;
  const actualGap =
    (firstAdditional?.y ?? 0) - ((lastFeatured?.y ?? 0) + (lastFeatured?.height ?? 0));

  expect(Math.abs(actualGap - expectedGap)).toBeLessThanOrEqual(1);
  expect(toggleBox?.y).toBeGreaterThan((lastAdditional?.y ?? 0) + (lastAdditional?.height ?? 0));
});

test("카테고리에서 브랜드와 모델번호를 바로 필터링한다", async ({ page }) => {
  await page.goto("/category/air-purifier");

  await expect(page.getByRole("link", { name: "검색에서 필터링 →" })).toHaveCount(0);
  const filter = page.locator("[data-category-model-filter]");
  const result = filter.locator("[data-filter-result]");
  await expect(result).toHaveText("45개 모델");
  await expect(filter.getByText("소모품 연결", { exact: true })).toHaveCount(0);

  const isOpen = await filter.evaluate((element) => (element as HTMLDetailsElement).open);
  if (!isOpen) {
    await filter.locator("summary").click();
  }

  if ((page.viewportSize()?.width ?? 0) > 700) {
    const filterBox = await filter.boundingBox();
    const brandLabelBox = await filter.locator(".category-filter-label").boundingBox();
    const brandChipBox = await filter.locator(".category-filter-chips").first().boundingBox();
    const brandLabelCenter = (brandLabelBox?.y ?? 0) + (brandLabelBox?.height ?? 0) / 2;
    const brandChipCenter = (brandChipBox?.y ?? 0) + (brandChipBox?.height ?? 0) / 2;
    expect(filterBox?.height).toBeLessThanOrEqual(160);
    expect(brandChipBox?.height).toBeLessThanOrEqual(40);
    expect(Math.abs(brandLabelCenter - brandChipCenter)).toBeLessThanOrEqual(1);
  }

  await filter.getByRole("button", { name: "LG", exact: true }).click();
  await expect(filter.getByRole("button", { name: "LG", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const lgItems = page.locator(".category-model-filter-item:not([hidden])");
  expect(await lgItems.count()).toBeGreaterThan(0);
  const visibleBrandIds = await lgItems.evaluateAll((items) =>
    items.map((item) => (item as HTMLElement).dataset.brandId),
  );
  expect(new Set(visibleBrandIds)).toEqual(new Set(["lg"]));

  await filter.getByRole("searchbox", { name: "모델번호" }).fill("AS205NGJA");
  await expect(result).toHaveText("5개 모델");

  await filter.getByRole("searchbox", { name: "모델번호" }).fill("없는모델번호");
  await expect(page.locator("[data-filter-empty]")).toBeVisible();
});
test("검색에서 소모품의 공식 호환 모델을 펼쳐 모델 상세로 이동한다", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const header = page.locator("header");
  await header.getByRole("combobox", { name: "모델번호·부품번호 검색" }).fill("ADQ30041405");
  await header.getByRole("button", { name: "소모품 찾기" }).click();

  await expect(page).toHaveURL(/\/find\?q=ADQ30041405/);
  await expect(page.getByRole("tab", { name: "소모품", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("heading", { name: "일치하는 소모품" })).toBeVisible();
  const partCard = page.locator(".search-part-card").filter({
    hasText: "LG 퓨리탈취청정 M 필터",
  });
  const compatibleModels = partCard.getByText(/공식 호환 모델 2개 보기/);
  await compatibleModels.click();
  await partCard.getByRole("link", { name: "LG AS355NSNA" }).click();

  await expect(page).toHaveURL(/\/model\/lg\/as355nsna#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("헤더 검색 인덱스는 첫 상호작용 전에는 내려받지 않는다", async ({ page }) => {
  const indexRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/search-index.json")) indexRequests.push(request.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });

  expect(indexRequests).toHaveLength(0);
  const responsePromise = page.waitForResponse(
    (response) => response.url().endsWith("/search-index.json") && response.ok(),
  );
  await page
    .locator("header")
    .getByRole("combobox", { name: "모델번호·부품번호 검색" })
    .fill("AS355NSNA");
  await responsePromise;

  await expect(page.locator("header").getByRole("option").first()).toContainText("AS355NSNA");
  expect(indexRequests).toHaveLength(1);
});

test("검색 결과 화면에서도 헤더 검색으로 다시 검색한다", async ({ page }) => {
  await page.goto("/find?q=필터");

  const header = page.locator("header");
  const searchInput = header.getByRole("combobox", { name: "모델번호·부품번호 검색" });
  await expect(searchInput).toHaveAttribute("placeholder", "모델번호·부품번호 검색");
  await searchInput.fill("AS355NSNA");
  await header.getByRole("button", { name: "소모품 찾기" }).click();

  await expect(page).toHaveURL(/\/find\?q=AS355NSNA/);
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

test("검색 첫 화면은 모델을 나눠 표시하고 더 보기로 확장한다", async ({ page }) => {
  await page.goto("/find");

  const cards = page.getByRole("tabpanel", { name: "모델" }).locator(".model-card");
  await expect(cards).toHaveCount(12);
  await page.getByRole("button", { name: "모델 더 보기" }).click();
  await expect(cards).toHaveCount(24);
});
test("모델 카드 전체를 클릭해 상세 페이지로 이동한다", async ({ page }) => {
  await page.goto("/category/air-purifier");

  const modelCard = page.locator(".model-card").filter({ hasText: "노블 공기청정기" }).first();
  await expect(modelCard).toHaveRole("link");
  await expect(modelCard).toHaveAccessibleName(/노블 공기청정기 모델 상세 보기/);
  await expect(modelCard).toHaveAttribute("href", /\/model\/coway\/[^/]+#compatible-parts$/);
  await expect(modelCard.getByRole("link", { name: /상세 보기/ })).toHaveCount(0);

  await modelCard.click({ position: { x: 20, y: 20 } });
  await expect(page).toHaveURL(/\/model\/coway\/[^/]+#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("묶인 모델 카드 전체를 클릭해 대표 모델로 이동한다", async ({ page }) => {
  await page.goto("/brand/lg");

  const groupCard = page.locator(".model-group-card").first();
  await expect(groupCard.locator("details")).toHaveCount(0);
  await expect(groupCard).toHaveRole("link");
  await expect(groupCard).toHaveAttribute("href", /\/model\/lg\/[^/]+#compatible-parts$/);

  await groupCard.click({ position: { x: 20, y: 20 } });
  await expect(page).toHaveURL(/\/model\/lg\/[^/]+#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("모델 상세에서 같은 제품군의 모델번호를 변경한다", async ({ page }) => {
  await page.goto("/model/lg/as205ngja");

  const selector = page.getByLabel("모델번호 선택");
  await expect(selector.locator("option")).toHaveCount(5);
  const optionLabels = await selector.locator("option").allTextContents();
  optionLabels.forEach((label) => expect(label.trim()).toMatch(/^[A-Z0-9-]+$/));
  await expect(selector).toHaveValue("/model/lg/as205ngja#compatible-parts");
  await selector.selectOption("/model/lg/as355nsna#compatible-parts");

  await expect(page).toHaveURL(/\/model\/lg\/as355nsna#compatible-parts$/);
  await expect(page.locator("#compatible-parts")).toBeVisible();
});

test("소모품 카드는 상품 확인과 제조사 호환 근거 행동만 제공한다", async ({ page }) => {
  await page.goto("/model/lg/as355nsna");

  const card = page.locator(".consumable-card").first();
  const coupangLink = card.getByRole("link", { name: /쿠팡 상품 보기/ });
  await expect(coupangLink).toHaveCount(1);
  await expect(coupangLink).toHaveAttribute("rel", /sponsored/);
  await expect(card.getByRole("link", { name: /공식 호환 근거/ })).toHaveCount(1);
  await expect(card.locator("details.purchase-warning-inline")).toHaveCount(0);
  const purchaseWarning = page.locator("details.purchase-warning-page");
  await expect(purchaseWarning).toHaveCount(1);
  await expect(purchaseWarning.getByText("구매 전 확인", { exact: true })).toBeVisible();
  await expect(card.getByText("교체주기 참고")).toHaveCount(0);
  await expect(card.getByText("부품번호 상태")).toHaveCount(0);
  await expect(card.getByText("검증 상태")).toHaveCount(0);
  await expect(card.getByText(/가격:/)).toHaveCount(0);
  await expect(card.getByText(/재고:/)).toHaveCount(0);
  await expect(card.locator(".coupang-link-status")).toHaveCount(0);
  await expect(card.locator(".affiliate-disclosure")).toContainText(
    "이 포스팅은 쿠팡 파트너스 활동의 일환으로",
  );
  await expect(card.getByText(/링크 확인 \d{4}-\d{2}-\d{2}/)).toHaveCount(0);
  const affiliateDisclosureLineCount = await card
    .locator(".affiliate-disclosure")
    .evaluate((element) => {
      const style = window.getComputedStyle(element);
      return Math.round(
        element.getBoundingClientRect().height / Number.parseFloat(style.lineHeight),
      );
    });
  expect(affiliateDisclosureLineCount).toBeLessThanOrEqual(2);
  await expect(card.getByRole("link", { name: /구매처 확인하기/ })).toHaveCount(0);
  await expect(card.getByRole("link", { name: /호환품 검색/ })).toHaveCount(0);
});

test("모델 확인 자료는 면책 안내 바로 위에 간결하게 제공한다", async ({ page }) => {
  await page.goto("/model/coway/ap-1521b");

  const references = page.getByRole("region", { name: "모델 확인 자료" });
  await expect(references.getByText("제조사 공식 출처")).toBeVisible();
  await expect(references.getByText("모델번호 확인 위치")).toBeVisible();
  await expect(page.getByText("같은 카테고리의 다른 모델")).toHaveCount(0);
  await expect(page.getByText("구매 전 확인 가이드")).toHaveCount(0);

  const sectionOrder = await page
    .locator(".model-reference-section, .model-disclaimer-section")
    .evaluateAll((sections) => sections.map((section) => section.className));
  expect(sectionOrder).toEqual([
    "detail-section model-reference-section",
    "detail-section model-disclaimer-section",
  ]);
});
test("제휴 안내에서 광고 위치와 운영 연락처를 공개한다", async ({ page }) => {
  await page.goto("/affiliate-disclosure");

  await expect(page.getByRole("heading", { name: "모델핏과 쿠팡의 관계" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "현재 광고 위치와 형식" })).toBeVisible();
  await expect(
    page.locator("main").getByRole("link", { name: "shwltjq1@gmail.com" }),
  ).toHaveAttribute("href", "mailto:shwltjq1@gmail.com");
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
