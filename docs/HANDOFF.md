# 모델핏 인수인계

최종 갱신: 2026-09-24 (Asia/Seoul)

## 현재 상태

- 공개 카탈로그: 브랜드 16개, 모델 80개, 소모품 177개
- 정적 빌드: 291페이지
- 제품 이미지: 모델 이미지 80개, 카테고리 이미지 2개
- 기본 데이터 원본: 비공개 관계형 CSV에서 생성한 정적 TypeScript 데이터
- 데이터베이스 전환 준비: Firebase Data Connect와 공통 카탈로그 저장소 구현 완료
- 배포 대상: Firebase Hosting `modelfit-kr`
- 오류 제보: 별도 Firestore 데이터베이스 `modelfit-reports`

## 데이터 구조

- `data/catalog/*.csv`: 비공개 관계형 원본 데이터
- `src/data/importedRelationalCatalog.ts`: CSV에서 생성한 로컬 전용 소모품·호환·이미지 데이터
- `src/data/importedCatalogMetadata.ts`: 경량 브랜드·카테고리 생성 데이터
- `src/data/catalogModels.ts`: 모델 원본과 화면용 데이터 생성
- `src/data/compatibilityMap.ts`: 모델과 소모품 연결
- `src/data/models.ts`: 화면에서 사용하는 모델 목록
- `src/data/consumables/index.ts`: 소모품 통합 진입점
- `src/data/consumables/*.ts`: 브랜드별 레거시 소모품 데이터
- `src/data/catalogRepository.ts`: CSV와 SQL Connect 저장소 선택
- CI 비공개 데이터 공급: [CI_CATALOG.md](CI_CATALOG.md) 참고
- `dataconnect/`: SQL Connect 스키마, 쿼리, 변경 작업
- `src/lib/dataconnect-generated/`: Firebase가 생성한 웹 SDK

원본 CSV, 생성 데이터, 시드 파일, 브랜드별 비공개 레코드는 Git에서 제외한다. 공개 저장소에 다시 추가하지 않는다. 자세한 정책은 [PRIVATE_DATA.md](PRIVATE_DATA.md)를 따른다.

## 구매 링크 원칙

- 카탈로그에 저장한 HTTPS 직접 상품 링크만 화면에 표시한다.
- 검색 결과 URL을 자동 생성하지 않는다.
- 링크가 없으면 구매 링크 없음 상태를 유지한다.
- 공식 호환 근거와 외부 판매 상품의 정품 여부는 별도로 취급한다.
- 제휴 링크에는 `nofollow sponsored noopener noreferrer`와 쿠팡 파트너스 고지를 유지한다.
- 자동 접근 차단은 품절이나 삭제를 뜻하지 않으므로 사람이 상품명, 모델번호, 판매자와 구성을 다시 확인한다.

## 이미지 원칙

- 제조사 공식 제품·지원 페이지 또는 사용 가능한 제조사 제공 이미지를 사용한다.
- 카드는 제품 전체가 보이도록 `object-fit: contain`을 유지한다.
- 모델별 이미지 경로, 대체 텍스트, 출처와 확인일은 `src/data/modelImages.ts`에서 관리한다.
- 외부 쇼핑몰 이미지를 무단 저장하지 않는다.

## 로컬 작업

```powershell
npm ci
npm run dev
npm run check
npm run test:e2e
```

기본 개발 서버는 `http://127.0.0.1:4321`이다. E2E 기본 포트 4322가 사용 중이면 다른 프로세스를 종료하지 말고 `MODELFIT_E2E_PORT`를 설정한다.

`dist`, `.astro`, `.firebase`, `.tmp-wasi`, `test-results`, `outputs`와 디버그 로그는 재생성 가능한 로컬 파일이다. 비공개 CSV와 `private-backups`는 임시 파일이 아니므로 삭제하지 않는다.

## 데이터 작업

```powershell
npm run catalog:check
npm run catalog:import
npm run catalog:update
npm run database:check
npm run database:local:test
```

`catalog:update`는 원본 검사, 생성 데이터 갱신, Data Connect 시드 생성, 데이터 검증과 비공개 백업을 수행한다. `database:local:test`는 데모 프로젝트의 로컬 에뮬레이터만 사용한다. 운영 SQL Connect 전환 전에는 비용, 인증, 성능과 장애 대응을 별도로 검토한다.

## 배포 전 확인

1. `npm run check`
2. `npm run test:e2e`
3. `npm audit --audit-level=high`
4. `npm run audit:freshness`
5. `npm run audit:sources`
6. Git diff와 비공개 데이터 포함 여부 확인
7. 사용자 승인 후 push와 Firebase Hosting 배포

Firestore 규칙을 변경했다면 Java 21 환경에서 Emulator 허용·거부 테스트를 반드시 통과시킨다. Hosting 배포만으로 Firestore 규칙은 배포되지 않는다.

## 운영 미완료 항목

- 운영 reCAPTCHA Enterprise 사이트 키와 App Check 강제 적용 확인
- 관리자 Google 로그인과 `admins/{uid}.active` 권한 확인
- 실제 제보 제출, 목록 조회와 상태 변경 확인
- SQL Connect 운영 프로젝트, Cloud SQL 비용과 권한 준비
- 쿠팡 링크의 가격, 재고, 판매자와 제품 구성 주기적 수동 확인

상세 링크 감사 기록은 [LINK_AUDIT.md](LINK_AUDIT.md), 운영 절차는 [OPERATIONS.md](OPERATIONS.md), 데이터베이스 계획은 [DATABASE.md](DATABASE.md)를 참고한다.

## 2026-10-02 정규화

원본은 v2 CSV 18개입니다. 모델 80개, 부품 177개, 호환 231개, 옵션 316개와 링크 326개의 ID·URL을 보존했습니다. 구매 149개와 안내 177개 링크를 분리했습니다. [계약과 검토 목록](CATALOG_NORMALIZATION.md)을 참고하세요. Windows 실행 정책으로 SQL 공식 컴파일·SDK 재생성·에뮬레이터 검증은 대기 중입니다. CI Secret 등록은 CSV 보완 후 진행합니다.
