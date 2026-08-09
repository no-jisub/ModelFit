import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { firebaseClientConfig } from "./config";

let appCheckInitialized = false;

export function isFirebaseConfigured() {
  return firebaseClientConfig !== null;
}

export function isAppCheckConfigured() {
  return Boolean(firebaseClientConfig?.appCheckSiteKey);
}

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseClientConfig) {
    throw new Error("Firebase 웹 설정이 아직 완료되지 않았습니다.");
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseClientConfig.options);

  if (
    typeof window !== "undefined" &&
    firebaseClientConfig.appCheckSiteKey &&
    !appCheckInitialized
  ) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(firebaseClientConfig.appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckInitialized = true;
  }

  return app;
}
