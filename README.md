# 모델핏(ModelFit)

가전 모델번호로 교체 소모품의 공식 호환 근거와 구매 링크를 찾는 정적 웹서비스입니다.
모델과 소모품은 비공개 관계형 CSV에서 관리합니다. 등록 개수는 `npm run validate:data`로 확인합니다.
모델 대표 이미지를 로컬 WebP로 제공하며, 카탈로그는 기본적으로 정적 페이지로 빌드합니다.

## 실행

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Astro SSG, TypeScript strict, React를 사용합니다. 검색·자동완성·제보·관리자 화면에 React를 사용하며,
카탈로그는 빌드 시 생성합니다. 기존 `/part/...` 주소는 해당 모델의 `#compatible-parts`로 이동합니다.
Firebase Hosting으로 배포하며, 오류 제보는 별도 Firestore 데이터베이스에 저장합니다.

## 이용 데이터와 보완 순서

실제 이용 이벤트를 중앙에서 수집하려면 `PUBLIC_GA_MEASUREMENT_ID`를 설정해야 합니다.
측정 ID가 없으면 브라우저의 현재 페이지 이벤트 큐만 남으며, 과거 이용 통계를 조회할 수 없습니다.

```bash
npm run analytics:report -- --from events.json
npm run catalog:priorities -- --from outputs/analytics/report.json
npm run catalog:priorities
```

분석 보고서는 검색어별 결과 조회·결과 없음과 모델별 조회·구매 클릭 횟수를 집계합니다.
마지막 명령은 이용 데이터 없이 구매 링크가 있는 미검증 연결을 우선하는 임시 작업 목록을 만듭니다.
이용량은 알 수 없음으로 표시하며 인기 순위나 주문 수로 해석하지 않습니다.
테스트 이벤트에는 `analytics:report`의 `--test-data`를 붙이고, 실제 작업 순위 입력에서는 제외합니다.

## 데이터 구조

| 파일                                  | 역할                                       |
| ------------------------------------- | ------------------------------------------ |
| `src/data/brands.ts`                  | 브랜드와 공식 출처 허용 도메인             |
| `src/data/catalogModels.ts`           | 모델 원본과 화면용 모델 생성               |
| `src/data/compatibilityMap.ts`        | 모델 ID별 소모품 ID 연결                   |
| `src/data/models.ts`                  | 모델 목록 진입점                           |
| `data/catalog/*.csv`                  | 모델·소모품·호환·구매 링크의 비공개 원본   |
| `src/data/importedCatalogMetadata.ts` | CSV에서 생성한 경량 브랜드·카테고리 데이터 |
| `src/data/consumables/index.ts`       | 소모품 정렬과 구매 선택지 생성             |
| `src/utils/validateData.ts`           | 출처·ID·양방향 호환 연결·구매 링크 검증    |

## 모델·소모품 추가

1. 공식 자료에서 모델번호와 적용 소모품을 확인합니다. 출처 URL과 실제 확인일을 기록합니다.
2. `data/catalog/models.csv`, `consumables.csv`와 관련 관계 CSV를 수정합니다. 화면용 TypeScript 파일을 직접 수정하지 않습니다.
3. `model-consumables.csv`에 모델과 소모품의 호환 관계를 등록하고 출처를 연결합니다.
4. `product-options.csv`, `purchase-links.csv`에 판매 구성과 구매 링크를 등록합니다.
5. `npm run catalog:update`로 검사·생성 데이터 갱신·백업을 수행합니다.
6. 관련 테스트와 빌드를 확인합니다. 배포할 때는 `npm run catalog:ci:pack` 후 CI 카탈로그 Secrets도 갱신합니다.

물리적으로 다른 교체 부품은 별도 소모품으로 등록합니다. 묶음 판매 수량은 소모품 이름에 섞지 않습니다.
정기 교체가 아닌 청소용 필터와 추가 선택 필터는 구분합니다. 부품번호·교체 주기·HEPA 등급을 추정하지 않습니다.
공식 제품 페이지가 존재한다는 사실만으로 특정 판매자의 상품을 정품으로 보증하지 않습니다.

## 구매 링크와 제휴 고지

- 쿠팡 검색 결과 URL은 카탈로그에 등록하지 않습니다.
- 직접 상품 URL이 없으면 `unavailable` 상태로 공식 근거만 제공합니다.
- 구매 링크는 관계형 카탈로그에 저장한 직접 상품 URL만 사용합니다.
- 공식 호환 근거와 외부 판매 상품의 진품·구성 확인은 별개입니다.
- 접근 차단 응답은 품절·링크 오류·상품 검증 완료를 뜻하지 않습니다. 판매 페이지는 사람이 재확인해야 합니다.
- 모든 쿠팡 상품 링크 아래에는 아래 문구를 유지합니다.

> 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.

제휴 링크는 `nofollow sponsored noopener noreferrer`와 새 창 열기를 적용합니다.

## 환경변수와 제보

`.env.example`을 참고합니다. 공개 변수의 실제 값과 서버 비밀값은 커밋하지 않습니다.

| 변수                                                     | 용도                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| `PUBLIC_SITE_URL`, `PUBLIC_SITE_NAME`                    | 사이트 주소와 이름                                         |
| `PUBLIC_REPORT_EMAIL`                                    | 이메일 제보 연락처. 비어 있으면 기존 공개 운영 이메일 사용 |
| `PUBLIC_GA_MEASUREMENT_ID`                               | 선택적 GA4. 비어 있으면 스크립트 미삽입                    |
| `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase 공개 웹 설정                                      |
| `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_APP_ID`   | Firebase 프로젝트와 웹 앱                                  |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`                    | 선택적 발신자 ID                                           |
| `PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`                     | reCAPTCHA Enterprise 공개 사이트 키                        |

사이트 제보 제출은 Firebase 웹 설정과 App Check 사이트 키가 모두 있어야 활성화됩니다.
운영에서는 App Check의 실제 강제 적용도 별도로 확인해야 합니다. 키 존재만으로 강제 적용을 검증할 수 없습니다.
사이트 접수가 어려울 때 `/report`에서 이메일 제보 경로를 제공합니다.
`PUBLIC_REPORT_FORM_URL`은 현재 제보 화면에서 사용하지 않는 이전 설정입니다.

관리자는 Google 로그인 후 `modelfit-reports` 데이터베이스의 `admins/{uid}.active`가 true여야
제보를 읽고 상태를 변경할 수 있습니다. 클라이언트에서는 관리자 권한을 부여할 수 없습니다.
설정 절차는 [운영 문서](docs/OPERATIONS.md)를 참고합니다.

## 검사

```bash
npm run check
npm run test:e2e
npm audit --audit-level=high
npm run audit:freshness
npm run audit:sources
```

`check`는 포맷, ESLint, 환경변수, 데이터, 단위 테스트, Firestore Emulator, 타입 검사와 빌드를 실행합니다.
Firestore Emulator에는 Java 21 이상이 필요합니다. 설치된 Java 21을 `JAVA_HOME`과 PATH에 지정하세요.

E2E는 데스크톱·모바일 Chromium에서 검색, 모델 전환, 소모품 구매 선택지, 제휴 고지, 제보 화면,
접근성, 가로 넘침과 성능을 검사합니다. 운영 로그인·실제 제보 접수는 별도 확인 항목입니다.
기본 포트 4322가 사용 중이면 다른 프로세스를 종료하지 않고 포트를 바꿉니다.

```powershell
$env:MODELFIT_E2E_PORT = '4323'
npm run test:e2e
```

## 배포

CI는 비공개 카탈로그 CSV를 GitHub Actions Secrets에서 복원한 뒤 생성 데이터를 만듭니다.
최초 설정과 데이터 갱신은 [CI 카탈로그 공급](docs/CI_CATALOG.md)을 참고하세요.

`main` push 시 `.github/workflows/deploy.yml`이 전체 검사, 취약점 검사와 브라우저 검사를 모두 통과한
빌드만 Firebase Hosting으로 배포합니다. 브라우저 검사는 빌드 결과를 재사용합니다.
`quality.yml`은 공개 운영 설정 없이도 동작하는지 별도 검사합니다.

- GitHub Secret: `FIREBASE_SERVICE_ACCOUNT_MODELFIT_KR`
- GitHub Variable: `FIREBASE_PROJECT_ID`
- 운영 사이트: <https://modelfit-kr.web.app/>

배포 승인 전에 변경 내역과 검사 결과를 확인합니다. 운영 절차는 [운영 문서](docs/OPERATIONS.md), 가격 갱신은 [구매 가격 운영](docs/purchase-prices.md)을 참고하세요.
`HANDOFF.md`, `RELEASE_REVIEW.md`와 날짜가 붙은 검토 문서는 당시 기록이며 현재 상태와 다를 수 있습니다.

## SEO와 출처 관리

브랜드·모델·카테고리·가이드는 정적 HTML과 canonical을 제공합니다. 검색·제보·관리자 페이지는 noindex입니다.
소모품의 이전 주소는 이동용이며 sitemap에서 제외합니다. 링크 접근 상태와 확인일은 매주 감사합니다.
90일 이후 재확인 예정, 180일 이후 재확인 필요로 분류하며, HTTP 응답만으로 확인일을 갱신하지 않습니다.

## 데이터베이스 확장

10만 개 규모의 제품 카탈로그를 위한 SQL Connect 설계와 운영 방법은 [데이터베이스 문서](docs/DATABASE.md)를 참고하세요.
