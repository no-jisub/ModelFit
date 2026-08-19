import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

const productionEnv = loadEnv("production", process.cwd(), "");

export default defineConfig({
  output: "static",
  site:
    process.env.PUBLIC_SITE_URL || productionEnv.PUBLIC_SITE_URL || "https://modelfit-kr.web.app",
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/part/") })],
  trailingSlash: "never",
});
