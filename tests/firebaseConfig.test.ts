import { describe, expect, it } from "vitest";
import { resolveFirebaseClientConfig } from "../src/lib/firebase/config";

describe("Firebase 공개 설정", () => {
  it("필수 식별자가 모두 있을 때만 활성화한다", () => {
    expect(resolveFirebaseClientConfig({ PUBLIC_FIREBASE_PROJECT_ID: "modelfit-kr" })).toBeNull();
    expect(
      resolveFirebaseClientConfig({
        PUBLIC_FIREBASE_API_KEY: "public-web-key",
        PUBLIC_FIREBASE_AUTH_DOMAIN: "modelfit-kr.firebaseapp.com",
        PUBLIC_FIREBASE_PROJECT_ID: "modelfit-kr",
        PUBLIC_FIREBASE_APP_ID: "web-app-id",
      })?.options.projectId,
    ).toBe("modelfit-kr");
  });
});
