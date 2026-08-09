# 모델핏 운영 체크리스트

## 지금 준비된 상태

- 환경변수가 없어도 로컬 개발과 정적 빌드가 동작합니다.
- 157개 소모품은 제조사 공식 근거를 먼저, 비제휴 쿠팡 일반 링크를 다음 순서로 제공합니다.
- GA4 측정 ID가 비어 있으면 분석 스크립트를 삽입하지 않습니다.
- 공식 출처와 구매 링크는 매주 자동 감사하며, 90일 이후 재확인 예정·180일 이후 재확인 필요로 표시합니다.

## 호스팅 직전 설정

GitHub 저장소의 **Settings → Secrets and variables → Actions**에서 다음을 설정합니다.

### Repository variables — 브라우저에 공개되는 값

| 변수                               | 필수         | 설명                                 |
| ---------------------------------- | ------------ | ------------------------------------ |
| `PUBLIC_SITE_URL`                  | 예           | 실제 HTTPS 도메인                    |
| `PUBLIC_SITE_NAME`                 | 예           | 기본값 `모델핏`                      |
| `PUBLIC_REPORT_FORM_URL`           | 권장         | 공개 오류 제보 폼 URL                |
| `PUBLIC_REPORT_EMAIL`              | 선택         | 화면에 공개해도 되는 제보 이메일     |
| `PUBLIC_GA_MEASUREMENT_ID`         | 나중에       | GA4 측정 ID. 호스팅 후 설정해도 됨   |
| `PUBLIC_COUPANG_BASE_URL`          | 제휴 시작 후 | 파트너스 정책을 확인한 검색 기본 URL |
| `PUBLIC_AFFILIATE_DISCLOSURE_TEXT` | 제휴 시작 후 | 실제 운영 정책에 맞는 제휴 고지 문구 |
| `FIREBASE_PROJECT_ID`              | 예           | Firebase 프로젝트 ID                 |

`PUBLIC_`으로 시작하는 값은 최종 HTML·JavaScript에서 누구나 확인할 수 있습니다. 비밀번호, API 비밀키, 서비스 계정 JSON은 절대 넣지 않습니다.

### Repository secrets — 외부에 공개하면 안 되는 값

| Secret                     | 필수 | 설명                             |
| -------------------------- | ---- | -------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT` | 예   | Firebase 배포용 서비스 계정 JSON |

서비스 계정은 최소 배포 권한만 부여하고, 유출이 의심되면 즉시 폐기·재발급합니다.

## 배포 전 확인

1. `npm ci` 후 `npm run check`와 `npm run test:e2e`를 실행합니다.
2. `npm audit --audit-level=high`가 0건인지 확인합니다.
3. `npm run audit:freshness`에서 오래된 데이터가 없는지 확인합니다.
4. `npm run audit:sources` 결과에서 접근 실패 링크를 직접 재확인합니다.
5. `public/robots.txt`의 sitemap 도메인을 실제 도메인으로 바꿉니다.
6. 제보 폼을 제출해 실제로 접수되는지 확인합니다.
7. 제휴 전에는 쿠팡 링크에 파트너스 식별자가 없고 비제휴 안내가 보이는지 확인합니다.

## 배포 후 확인

1. 홈 검색 → 소모품 상세 → 구매처 링크 흐름을 데스크톱과 모바일에서 확인합니다.
2. canonical URL, `robots.txt`, sitemap이 실제 도메인을 가리키는지 확인합니다.
3. GA4를 연결했다면 실시간 보고서에서 검색·상세·구매 링크 클릭 이벤트를 확인합니다.
4. GitHub Actions의 배포, 브라우저 품질, 주간 링크 감사가 모두 성공하는지 확인합니다.

## 보안 원칙

- `.env`, `.env.production`, 서비스 계정 JSON과 토큰은 커밋하지 않습니다.
- 공개 측정 ID는 비밀키가 아니지만, 값은 코드 대신 배포 환경변수로 관리합니다.
- PR과 배포 전 `npm audit --audit-level=high`를 통과시킵니다.
- Dependabot PR은 테스트가 통과한 경우에만 병합합니다.
