# 모델핏 운영 체크리스트

## 지금 준비된 상태

- 환경변수가 없어도 로컬 개발과 정적 빌드가 동작하며 오류 제보 제출은 안전하게 차단됩니다.
- 157개 소모품은 제조사 공식 근거를 먼저, 비제휴 쿠팡 일반 링크를 다음 순서로 제공합니다.
- GA4 측정 ID가 비어 있으면 분석 스크립트를 삽입하지 않습니다.
- 공식 출처와 구매 링크는 매주 자동 감사하며, 90일 이후 재확인 예정·180일 이후 재확인 필요로 표시합니다.

## 호스팅 직전 설정

GitHub 저장소의 **Settings → Secrets and variables → Actions**에서 다음을 설정합니다.

### Repository variables — 브라우저에 공개되는 값

| 변수                                  | 필수         | 설명                                 |
| ------------------------------------- | ------------ | ------------------------------------ |
| `PUBLIC_SITE_URL`                     | 예           | 실제 HTTPS 도메인                    |
| `PUBLIC_SITE_NAME`                    | 예           | 기본값 `모델핏`                      |
| `PUBLIC_GA_MEASUREMENT_ID`            | 나중에       | GA4 측정 ID. 호스팅 후 설정해도 됨   |
| `PUBLIC_COUPANG_BASE_URL`             | 제휴 시작 후 | 파트너스 정책을 확인한 검색 기본 URL |
| `PUBLIC_AFFILIATE_DISCLOSURE_TEXT`    | 제휴 시작 후 | 실제 운영 정책에 맞는 제휴 고지 문구 |
| `FIREBASE_PROJECT_ID`                 | 예           | Firebase 프로젝트 ID                 |
| `PUBLIC_FIREBASE_API_KEY`             | 제보 개시 전 | Firebase 웹 API 공개 식별자          |
| `PUBLIC_FIREBASE_AUTH_DOMAIN`         | 제보 개시 전 | `modelfit-kr.firebaseapp.com`        |
| `PUBLIC_FIREBASE_PROJECT_ID`          | 제보 개시 전 | `modelfit-kr`                        |
| `PUBLIC_FIREBASE_APP_ID`              | 제보 개시 전 | Firebase 웹 앱 ID                    |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 선택         | Firebase 발신자 ID                   |
| `PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`  | 제보 개시 전 | reCAPTCHA Enterprise 공개 사이트 키  |

`PUBLIC_`으로 시작하는 값은 최종 HTML·JavaScript에서 누구나 확인할 수 있습니다. 비밀번호, API 비밀키, 서비스 계정 JSON은 절대 넣지 않습니다.

### Repository secrets — 외부에 공개하면 안 되는 값

| Secret                                 | 필수 | 설명                                     |
| -------------------------------------- | ---- | ---------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_MODELFIT_KR` | 예   | Firebase Hosting 배포용 서비스 계정 JSON |

서비스 계정은 최소 배포 권한만 부여하고, 유출이 의심되면 즉시 폐기·재발급합니다.

## 배포 전 확인

1. `npm ci` 후 `npm run check`와 `npm run test:e2e`를 실행합니다.
2. `npm audit --audit-level=high`가 0건인지 확인합니다.
3. `npm run audit:freshness`에서 오래된 데이터가 없는지 확인합니다.
4. `npm run audit:sources` 결과에서 접근 실패 링크를 직접 재확인합니다.
5. `public/robots.txt`의 sitemap 도메인을 실제 도메인으로 바꿉니다.
6. App Check 적용 후 사이트 제보를 제출해 실제로 접수되는지 확인합니다.
7. 제휴 전에는 쿠팡 링크에 파트너스 식별자가 없고 비제휴 안내가 보이는지 확인합니다.

## 배포 후 확인

1. 홈 검색 → 소모품 상세 → 구매처 링크 흐름을 데스크톱과 모바일에서 확인합니다.
2. canonical URL, `robots.txt`, sitemap이 실제 도메인을 가리키는지 확인합니다.
3. GA4를 연결했다면 실시간 보고서에서 검색·상세·구매 링크 클릭 이벤트를 확인합니다.
4. GitHub Actions의 배포, 브라우저 품질, 주간 링크 감사가 모두 성공하는지 확인합니다.

## 오류 제보·관리자 기능 초기 설정

오류 제보 기능은 Firebase 공개 웹 설정, Firestore, Google 로그인, App Check가 모두 준비되기
전까지 제출 버튼을 비활성화합니다. 서비스 계정 키나 관리자 비밀번호를 프런트엔드 환경변수에
넣지 않습니다.

1. Firebase Console에서 Cloud Firestore 데이터베이스를 생성합니다. 위치는 생성 후 바꾸기
   어려우므로 운영 사용자와 가까운 위치를 선택합니다.
2. Authentication > 로그인 방법에서 Google 제공업체를 사용 설정하고 지원 이메일을 선택합니다.
3. Google Cloud Console에서 reCAPTCHA Enterprise 점수 기반 웹 키를 만들고
   `modelfit-kr.web.app` 도메인을 등록합니다. Firebase Console > App Check에서 같은 웹 앱과 키를
   연결합니다.
4. GitHub 저장소 변수에 `.env.example`의 `PUBLIC_FIREBASE_*` 값을 등록합니다. 웹 API 키와 App
   Check 사이트 키는 브라우저에 공개되는 식별자이며, 서비스 계정 비밀키로 취급하지 않습니다.
5. Firebase CLI 로그인 계정으로 다음 명령을 실행해 보안 규칙을 배포합니다. Spark 요금제에서는
   무료 할당량에 포함되지 않는 TTL 자동 삭제를 사용하지 않습니다.

   ```powershell
   firebase deploy --only firestore:rules --project modelfit-kr
   ```

6. 배포된 `/admin`에서 관리자 전용 Google 계정으로 한 번 로그인합니다. 화면에 표시된 UID를
   Firebase Console > Firestore의 `admins` 컬렉션에 문서 ID로 만들고 Boolean 필드
   `active: true`를 추가합니다. 비밀번호는 저장하거나 공유하지 않습니다.
7. `/admin` 재로그인 후 제보 목록 접근을 확인하고, `/report`에서 시험 제보가 접수되는지
   확인합니다.
8. Firebase Console > App Check에서 정상 요청 지표를 먼저 확인한 뒤 Cloud Firestore 적용을
   사용 설정합니다. 적용 전에는 공개 접수를 운영하지 않습니다.

보안 규칙은 일반 사용자의 제보 생성만 허용하며 읽기·수정·삭제를 금지합니다. 활성 관리자만
최대 100건씩 읽고 상태 필드만 변경할 수 있습니다. 관리자 등록 문서는 클라이언트에서 만들거나
수정할 수 없습니다. 각 제보에는 1년 뒤의 `expiresAt`이 기록되며, 운영자는 관리자 화면의
보관 만료일을 기준으로 Firebase Console에서 만료 문서를 수동 삭제합니다.

## 보안 원칙

- `.env`, `.env.production`, 서비스 계정 JSON과 토큰은 커밋하지 않습니다.
- 공개 측정 ID는 비밀키가 아니지만, 값은 코드 대신 배포 환경변수로 관리합니다.
- Firebase 웹 API 키와 App Check 사이트 키는 공개 식별자입니다. Cloud API 키의 HTTP 리퍼러와
  API 제한, Firestore 규칙, App Check 적용을 함께 유지합니다.
- PR과 배포 전 `npm audit --audit-level=high`를 통과시킵니다.
- Dependabot PR은 테스트가 통과한 경우에만 병합합니다.
