# 모델핏(ModelFit)

가전제품 브랜드와 모델명을 검색해 공기청정기 필터, 로봇청소기 브러시·먼지봉투·물걸레 패드 등 호환 소모품 정보를 찾는 정적 웹서비스 MVP입니다. 상품 판매보다 모델 코드, 검증 상태, 출처와 구매 전 주의사항을 먼저 보여줍니다.

> 공개 서비스에는 제조사 공식 자료에서 모델명이 확인된 85개 모델만 포함합니다.
> 공식 소모품 호환 근거가 없는 모델에는 호환품을 연결하지 않습니다.

## 기술 스택

- Astro SSG + TypeScript strict mode
- React: 검색창, 자동완성, 검색 결과 필터에만 선택적 hydration
- 정적 TypeScript 데이터
- Vitest, ESLint, Prettier, Astro Check
- Firebase Hosting

## 로컬 실행

```bash
npm install
cp .env.example .env
npm run dev
```

프로덕션 빌드와 로컬 미리보기:

```bash
npm run build
npm run preview
```

## 환경변수

`.env.example`을 `.env`로 복사해 설정합니다. 모든 값은 비어 있어도 로컬 개발과 빌드가 동작합니다.

| 변수                               | 용도                                             |
| ---------------------------------- | ------------------------------------------------ |
| `PUBLIC_SITE_URL`                  | canonical, sitemap 기준 URL                      |
| `PUBLIC_SITE_NAME`                 | 사이트 이름                                      |
| `PUBLIC_REPORT_FORM_URL`           | 외부 오류 제보 폼                                |
| `PUBLIC_REPORT_EMAIL`              | 폼이 없을 때 mailto 제보를 받을 공개 이메일      |
| `PUBLIC_COUPANG_BASE_URL`          | 제휴 검색 기본 URL. 비어 있으면 구매 버튼 비활성 |
| `PUBLIC_AFFILIATE_DISCLOSURE_TEXT` | 제휴 고지 문구                                   |
| `PUBLIC_GA_MEASUREMENT_ID`         | GA4 측정 ID. 비어 있으면 스크립트 미삽입         |

배포 전 `public/robots.txt`의 sitemap URL도 실제 도메인으로 변경합니다.
제보 폼과 이메일이 모두 비어 있으면 제보 입력 폼은 안전하게 비활성화됩니다.

## 데이터 구조와 추가 방법

데이터는 `src/data` 아래의 세 파일로 분리합니다.

- `brands.ts`: 브랜드와 지원 카테고리
- `models.ts`: 모델명, 코드, 별칭, 검증 상태, 연결된 소모품 ID
- `consumables.ts`: 소모품 유형, 호환 모델 ID, 부품번호, 출처, 제휴 검색어

### 브랜드 추가

`src/data/brands.ts`에 고유한 `id`, URL용 `slug`, 한글·영문명과 지원 카테고리를 추가합니다.

```ts
{
  id: "sample-brand",
  slug: "sample-brand",
  name: "샘플",
  nameEn: "Sample",
  supportedCategories: ["air-purifier"]
}
```

### 모델 추가

1. `brandId`가 실제 브랜드 ID인지 확인합니다.
2. `modelCode`를 정확히 입력하고 검색용 `aliases`를 추가합니다.
3. 실제 출처가 없다면 `verificationStatus: "unverified"`, `sources: []`로 둡니다.
4. 연결할 소모품 ID를 `consumableIds`에 추가합니다.

```ts
{
  id: "sample-ap100",
  slug: "ap100",
  category: "air-purifier",
  brandId: "sample-brand",
  brandName: "샘플",
  brandNameEn: "Sample",
  modelName: "샘플 공기청정기",
  modelCode: "AP100",
  aliases: ["샘플 AP100", "Sample AP100"],
  shortDescription: "공식 자료 확인 전 데이터",
  modelNumberLocation: "제품 후면 라벨",
  consumableIds: ["sample-filter"],
  sources: [],
  lastVerifiedAt: "2026-07-27",
  verificationStatus: "unverified",
  isDemo: false
}
```

### 소모품 추가

`compatibleModelIds`와 각 모델의 `consumableIds`를 양쪽에서 연결합니다. 부품번호를 추정하지 말고, 없으면 필드를 생략합니다.

```ts
{
  id: "sample-filter",
  slug: "sample-filter",
  type: "hepa-filter",
  displayName: "샘플 집진 필터",
  compatibleModelIds: ["sample-ap100"],
  searchKeywords: ["샘플 AP100 필터"],
  verificationStatus: "unverified",
  sources: [],
  affiliate: { searchKeyword: "샘플 AP100 필터", enabled: true }
}
```

## 검증 상태 기준

- `official`: 제조사 공식 설명서·지원·판매 페이지에서 모델과 소모품 연결을 확인했고 유효한 출처가 있음
- `seller-confirmed`: 판매자 표기를 확인했으나 제조사 자료로 교차 검증하지 못함
- `user-reported`: 근거가 포함된 사용자 제보를 접수했으나 운영 검토 중
- `unverified`: 공식 근거가 없거나 확인 전

`official` 상태에는 최소 1개의 출처가 반드시 있어야 합니다. `npm run validate:data`가 이 규칙과
중복 slug, 중복 모델 코드, 끊어진 참조를 확인합니다.

## 출처 작성 규칙

- 제조사 공식 설명서 → 공식 지원 페이지 → 공식 판매 페이지 → 판매자 → 기타 순으로 우선합니다.
- URL을 실제로 열어 모델 코드와 부품번호를 확인한 뒤 기록합니다.
- 검색 결과 URL, 단축 URL, 존재하지 않는 예시 URL을 출처로 넣지 않습니다.
- `checkedAt`은 실제로 확인한 날짜를 `YYYY-MM-DD` 형식으로 기록합니다.
- 출처가 없으면 빈 배열을 유지하고 미검증 상태로 표시합니다.

## 검색

`normalizeSearch.ts`가 소문자 변환, 공백·하이픈·언더스코어 제거, 특수문자 제거와 한글 브랜드 별칭을 처리합니다. 우선순위는 모델 코드 완전 일치, 모델명 완전 일치, 별칭, 부분 일치, 브랜드+모델, 유사 일치 순입니다.

## 쿠팡·제휴 링크

코드에 실제 제휴 URL을 하드코딩하지 않습니다. `PUBLIC_COUPANG_BASE_URL`을 설정하면 검색어를 `q` 매개변수로 추가합니다. 모든 링크는 `rel="nofollow sponsored noopener noreferrer"`와 `target="_blank"`를 사용합니다. 실제 파트너스 URL 형식이 다르면 `src/utils/affiliate.ts`를 공급자 규격에 맞게 수정하세요.

## 테스트와 품질 검사

```bash
npm run lint
npm run format
npm run test
npm run validate:data
npm run build
npm run check
```

`npm run check`는 lint, 데이터 검증, 단위 테스트, 타입 검사와 정적 빌드를 순서대로 실행합니다.

## SEO 운영

- 카테고리, 브랜드, 모델, 소모품, 가이드는 빌드 시 정적 HTML로 생성됩니다.
- `@astrojs/sitemap`이 sitemap을 만듭니다.
- 각 페이지는 개별 title, description, canonical, Open Graph, Twitter 메타를 가집니다.
- 검색 결과와 제보 페이지는 `noindex`입니다.
- 홈은 `WebSite`, `Organization`; 모델은 `BreadcrumbList`; 가이드는 `Article` JSON-LD를 사용합니다.
- 판매 가격과 재고가 없으므로 `Product` 구조화 데이터는 사용하지 않습니다.

## Firebase Hosting 배포

1. `.firebaserc.example`을 `.firebaserc`로 복사하고 프로젝트 ID를 바꿉니다.
2. `PUBLIC_SITE_URL`과 `public/robots.txt`를 실제 도메인으로 변경합니다.
3. Firebase CLI에서 로그인 후 빌드·배포합니다.

```bash
npm run build
npx firebase-tools deploy --only hosting
```

`firebase.json`에는 clean URL, 정적 자산 장기 캐시, HTML 짧은 캐시와 기본 보안 헤더가 포함됩니다. 전체 경로를 SPA로 rewrite하지 않습니다.

## GitHub Actions

`.github/workflows/deploy.yml`은 PR에서 `npm run check`를 실행하고 main push에서 Firebase Hosting을 배포합니다.

- Secret: `FIREBASE_SERVICE_ACCOUNT`
- Variable: `FIREBASE_PROJECT_ID`

저장소 정책에 맞춰 배포 브랜치와 승인 환경을 추가하는 것을 권장합니다.

## 실제 데이터 등록 시 주의사항

- 모델명이나 부품번호를 추정하지 않습니다.
- 한 소모품이 여러 모델과 호환돼도 제조사 근거가 없으면 공식 확인으로 표시하지 않습니다.
- 동일 시리즈라도 출시 연도, 국가, 색상 접미사에 따라 규격이 달라질 수 있습니다.
- 사용자 제보만으로 공식 확인 상태로 올리지 않습니다.
- 데이터 변경 뒤 `npm run check`와 생성된 모델·소모품 페이지를 확인합니다.
