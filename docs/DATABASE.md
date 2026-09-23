# 제품 카탈로그 데이터베이스

모델핏의 대규모 카탈로그는 Firebase SQL Connect와 Cloud SQL for PostgreSQL로 이전할 수 있도록 구성되어 있습니다. 현재 공개 사이트는 CSV로 생성한 정적 데이터를 계속 사용하므로 데이터베이스 준비 작업이 운영 화면을 바꾸지 않습니다.

## 구조

- `Category`, `Brand`, `BrandCategory`: 카테고리와 브랜드의 다대다 관계
- `Model`, `ModelAlias`, `ModelImage`: 제품 모델, 검색 별칭, 이미지
- `Consumable`, `ModelConsumable`: 소모품과 모델의 다대다 호환 관계
- `Source`, `ModelSource`, `ConsumableSource`: 정보 출처와 검증 근거
- `ProductOption`, `ProductOptionSource`, `PurchaseLink`: 정품·호환 옵션, 검증 출처와 구매 링크

제품 모델번호는 브랜드 안에서 중복될 수 없고, 공개 조회는 `PUBLISHED` 데이터만 반환합니다. 쓰기 작업은 Firebase Authentication의 `admin: true` 사용자 지정 클레임이 있는 관리자만 사용할 수 있습니다.

## 로컬 생성·검사·적재

Java 21을 사용한 뒤 다음 명령을 실행합니다.

```powershell
npm run database:check
npm run database:local:test
```

`database:check`는 비공개 CSV 전체에서 로컬 전용 `dataconnect/seed_data.gql`을 생성하고, 14개 테이블·권한·관계·원본 ID 포함 여부를 검사합니다.

`database:local:test`는 별도의 데모 프로젝트로 SQL Connect와 PostgreSQL 에뮬레이터를 시작한 뒤 CSV 전체를 멱등 업서트하고, 생성된 웹 SDK로 카테고리·브랜드·모델 수를 다시 조회합니다. 실제 Firebase 프로젝트나 Cloud SQL에는 쓰지 않습니다.

`database:import`는 `FIREBASE_DATA_CONNECT_EMULATOR_HOST`가 없으면 즉시 중단하도록 만들었습니다. 이 보호 장치 때문에 실수로 운영 데이터베이스에 시드를 넣지 않습니다.

## CSV와 SQL Connect 전환

애플리케이션은 `src/data/catalogRepository.ts`의 공통 인터페이스로 두 데이터 원본을 선택할 수 있습니다.

```dotenv
PUBLIC_CATALOG_DATA_SOURCE=csv
PUBLIC_DATA_CONNECT_EMULATOR_HOST=
```

기본값은 `csv`이며 현재 정적 페이지 동작을 유지합니다. `sql-connect`를 지정하면 생성된 `@modelfit/dataconnect` SDK를 동적으로 불러옵니다. 운영 전환 전에는 SQL Connect 배포, Firebase 웹 설정, 성능 확인과 오류 대응을 먼저 끝내야 합니다.

## 클라우드 연결 전 준비

1. Blaze 요금제와 Cloud SQL 비용을 확인합니다.
2. Firebase SQL Connect API를 활성화합니다.
3. 로컬 계정에 Application Default Credentials와 SQL Connect 조회·관리 권한을 설정합니다.
4. `npm run database:compile`로 공식 컴파일을 통과시킵니다.
5. 생성될 Cloud SQL 인스턴스와 마이그레이션 차이를 검토한 후 배포합니다.

현재 실제 프로젝트 컴파일은 SQL Connect API, Application Default Credentials, 조회 권한이 준비되지 않아 HTTP 403으로 차단됩니다. 로컬 에뮬레이터 검증에는 영향이 없으며, 클라우드 자원이나 비용은 생성하지 않았습니다.
