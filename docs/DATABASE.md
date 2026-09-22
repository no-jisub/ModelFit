# 제품 카탈로그 데이터베이스

모델핏의 대규모 카탈로그는 Firebase SQL Connect와 Cloud SQL for PostgreSQL로 이전할 수 있도록 구성되어 있습니다. 현재 정적 사이트는 기존 CSV를 계속 읽으며, 데이터베이스 준비가 끝날 때까지 운영 방식이 바뀌지 않습니다.

## 구조

- `Category`, `Brand`, `BrandCategory`: 카테고리와 브랜드의 다대다 관계
- `Model`, `ModelAlias`, `ModelImage`: 제품 모델, 검색 별칭, 이미지
- `Consumable`, `ModelConsumable`: 소모품과 모델의 다대다 호환 관계
- `Source`, `ModelSource`, `ConsumableSource`: 정보 출처와 검증 근거
- `ProductOption`, `PurchaseLink`: 정품·호환 옵션과 구매 링크

제품 모델번호는 브랜드 안에서 중복될 수 없고, 공개 조회는 `PUBLISHED` 데이터만 반환합니다. 쓰기 작업은 Firebase Authentication의 `admin: true` 사용자 지정 클레임이 있는 관리자만 사용할 수 있습니다.

## 로컬 데이터 생성과 검사

```powershell
npm run database:seed
npm run database:check
```

`database:seed`는 현재 카테고리, 브랜드와 `data/import/models.csv`를 읽어 `dataconnect/seed_data.gql`을 다시 만듭니다. 이 파일은 로컬 에뮬레이터에서만 사용합니다.

`database:check`는 GraphQL 포맷과 설정, 필수 테이블, 공개·관리자 권한, 현재 80개 모델의 시드 포함 여부를 검사합니다.

## 클라우드 연결 전 준비

SQL Connect를 실제로 만들려면 Firebase 프로젝트에서 다음 준비가 필요합니다.

1. Blaze 요금제와 Cloud SQL 비용을 확인합니다.
2. Firebase SQL Connect API를 활성화합니다.
3. 로컬 계정에 Application Default Credentials와 SQL Connect 조회·관리 권한을 설정합니다.
4. `npm run database:compile`로 공식 컴파일을 통과시킵니다.
5. 생성될 Cloud SQL 인스턴스와 마이그레이션 차이를 검토한 후 배포합니다.

클라우드 배포 전까지 `npm run database:compile`, `npm run database:sdk`, 배포 명령은 정상적인 프로젝트 권한이 필요합니다. Cloud SQL 생성은 비용이 발생하므로 별도 검토 후 실행합니다.
