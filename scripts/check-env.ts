const publicEnv = {
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL?.trim(),
  PUBLIC_SITE_NAME: process.env.PUBLIC_SITE_NAME?.trim(),
  PUBLIC_COUPANG_BASE_URL: process.env.PUBLIC_COUPANG_BASE_URL?.trim(),
  PUBLIC_AFFILIATE_DISCLOSURE_TEXT: process.env.PUBLIC_AFFILIATE_DISCLOSURE_TEXT?.trim(),
  PUBLIC_GA_MEASUREMENT_ID: process.env.PUBLIC_GA_MEASUREMENT_ID?.trim(),
  PUBLIC_FIREBASE_API_KEY: process.env.PUBLIC_FIREBASE_API_KEY?.trim(),
  PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  PUBLIC_FIREBASE_PROJECT_ID: process.env.PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  PUBLIC_FIREBASE_APP_ID: process.env.PUBLIC_FIREBASE_APP_ID?.trim(),
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  PUBLIC_FIREBASE_APP_CHECK_SITE_KEY: process.env.PUBLIC_FIREBASE_APP_CHECK_SITE_KEY?.trim(),
};

const errors: string[] = [];

function checkHttpsUrl(name: keyof typeof publicEnv) {
  const value = publicEnv[name];
  if (!value) return;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") errors.push(`${name}은 https:// URL이어야 합니다.`);
  } catch {
    errors.push(`${name}이 올바른 URL이 아닙니다.`);
  }
}

checkHttpsUrl("PUBLIC_SITE_URL");
checkHttpsUrl("PUBLIC_COUPANG_BASE_URL");

if (
  publicEnv.PUBLIC_GA_MEASUREMENT_ID &&
  !/^G-[A-Z0-9]+$/.test(publicEnv.PUBLIC_GA_MEASUREMENT_ID)
) {
  errors.push("PUBLIC_GA_MEASUREMENT_ID는 G-로 시작하는 GA4 측정 ID여야 합니다.");
}

const firebaseRequired = [
  publicEnv.PUBLIC_FIREBASE_API_KEY,
  publicEnv.PUBLIC_FIREBASE_AUTH_DOMAIN,
  publicEnv.PUBLIC_FIREBASE_PROJECT_ID,
  publicEnv.PUBLIC_FIREBASE_APP_ID,
];
const configuredFirebaseValues = firebaseRequired.filter(Boolean).length;
if (configuredFirebaseValues > 0 && configuredFirebaseValues < firebaseRequired.length) {
  errors.push(
    "Firebase 공개 설정은 API 키, 인증 도메인, 프로젝트 ID, 앱 ID를 함께 설정해야 합니다.",
  );
}
if (
  publicEnv.PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !/^[a-z0-9.-]+\.firebaseapp\.com$/i.test(publicEnv.PUBLIC_FIREBASE_AUTH_DOMAIN)
) {
  errors.push("PUBLIC_FIREBASE_AUTH_DOMAIN이 올바른 Firebase 인증 도메인이 아닙니다.");
}

const unsafePublicNames = Object.keys(process.env).filter(
  (name) =>
    name.startsWith("PUBLIC_") &&
    name !== "PUBLIC_FIREBASE_API_KEY" &&
    /(SECRET|PASSWORD|PRIVATE|SERVICE_ACCOUNT|API_KEY|TOKEN)/i.test(name),
);
if (unsafePublicNames.length > 0) {
  errors.push(`공개 변수 이름에 비밀값 표기가 있습니다: ${unsafePublicNames.join(", ")}`);
}

if (errors.length > 0) {
  console.error("환경변수 검사 실패:\n- " + errors.join("\n- "));
  process.exitCode = 1;
} else {
  const configured = Object.values(publicEnv).filter(Boolean).length;
  console.log(`환경변수 검사 통과: 공개 변수 ${configured}개 설정, 비밀값 노출 징후 없음`);
}
