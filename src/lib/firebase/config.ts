import type { FirebaseOptions } from "firebase/app";

export interface FirebasePublicEnv {
  PUBLIC_FIREBASE_API_KEY?: string;
  PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  PUBLIC_FIREBASE_PROJECT_ID?: string;
  PUBLIC_FIREBASE_APP_ID?: string;
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  PUBLIC_FIREBASE_APP_CHECK_SITE_KEY?: string;
}

export interface FirebaseClientConfig {
  options: FirebaseOptions;
  appCheckSiteKey?: string;
}

const FIREBASE_HOSTING_AUTH_DOMAIN = "modelfit-kr.web.app";

function clean(value?: string) {
  return value?.trim() || undefined;
}

export function resolveFirebaseClientConfig(env: FirebasePublicEnv): FirebaseClientConfig | null {
  const apiKey = clean(env.PUBLIC_FIREBASE_API_KEY);
  const authDomain = clean(env.PUBLIC_FIREBASE_AUTH_DOMAIN);
  const projectId = clean(env.PUBLIC_FIREBASE_PROJECT_ID);
  const appId = clean(env.PUBLIC_FIREBASE_APP_ID);

  if (!apiKey || !authDomain || !projectId || !appId) return null;

  return {
    options: {
      apiKey,
      authDomain,
      projectId,
      appId,
      messagingSenderId: clean(env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    },
    appCheckSiteKey: clean(env.PUBLIC_FIREBASE_APP_CHECK_SITE_KEY),
  };
}

export function resolveFirebaseAuthDomain(configuredDomain: string, hostname?: string) {
  return hostname === FIREBASE_HOSTING_AUTH_DOMAIN
    ? FIREBASE_HOSTING_AUTH_DOMAIN
    : configuredDomain;
}

export const firebaseClientConfig = resolveFirebaseClientConfig(import.meta.env);
