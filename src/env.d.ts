/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_AFFILIATE_DISCLOSURE_TEXT?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_FIREBASE_API_KEY?: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID?: string;
  readonly PUBLIC_FIREBASE_APP_ID?: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly PUBLIC_FIREBASE_APP_CHECK_SITE_KEY?: string;
  readonly PUBLIC_CATALOG_DATA_SOURCE?: "csv" | "sql-connect";
  readonly PUBLIC_DATA_CONNECT_EMULATOR_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
