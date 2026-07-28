/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_REPORT_FORM_URL?: string;
  readonly PUBLIC_REPORT_EMAIL?: string;
  readonly PUBLIC_COUPANG_BASE_URL?: string;
  readonly PUBLIC_AFFILIATE_DISCLOSURE_TEXT?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
