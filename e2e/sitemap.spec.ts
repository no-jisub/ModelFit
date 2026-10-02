import { expect, test } from "@playwright/test";
test("사이트맵에는 공개 색인 페이지만 포함한다", async ({ request }) => {
  const response = await request.get("/sitemap-0.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname.replace(/\/$/, "") || "/",
  );
  expect(paths).toContain("/model/lg/as355nsna");
  expect(paths).toContain("/category/air-purifier");
  for (const path of ["/find", "/report", "/admin", "/search-index.json", "/404", "/404.html"])
    expect(paths).not.toContain(path);
  expect(paths.some((path) => path.startsWith("/part/") || path.startsWith("/admin/"))).toBe(false);
});
