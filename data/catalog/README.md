# 관계형 CSV 카탈로그

이 폴더는 사이트 데이터를 PostgreSQL로 옮길 수 있도록 관계형 테이블 형태로 나눈 CSV입니다. 모든 파일은 Excel에서 한글이 깨지지 않도록 UTF-8 BOM으로 저장합니다.

## 파일 관계

- `categories.csv`: 제품 카테고리
- `brands.csv`: 제조사와 지원 카테고리
- `../import/models.csv`: 제품 모델 원본
- `consumables.csv`: 필터, 브러시, 걸레, 먼지봉투 등 소모품
- `model-consumables.csv`: 모델과 소모품의 다대다 호환 관계
- `sources.csv`: 제조사, 공식 설명서, 판매자 등 검증 출처
- `entity-sources.csv`: 모델·소모품·제품 옵션과 출처의 연결
- `product-options.csv`: 정품·호환 상품 선택지
- `purchase-links.csv`: 공식 판매처와 제휴 구매 링크
- `images.csv`: 모델 대표 이미지와 이미지 출처

각 파일의 `id`는 다른 CSV에서 참조하므로 사람이 읽기 어려워도 임의로 변경하지 않습니다. 여러 값을 한 칸에 저장하는 필드는 `|`로 구분합니다.

## 권장 작업 순서

1. `data/catalog/*.csv`와 `data/import/models.csv`를 수정합니다.
2. 다음 명령 하나를 실행합니다.

```bash
npm run catalog:update
```

이 명령은 다음 작업을 순서대로 수행하며, 중간 검사가 실패하면 뒤 작업을 실행하지 않습니다.

1. 원본 CSV의 필수값, 기본키 중복, 참조 관계, 날짜, URL, 불리언과 허용값 검사
2. 사이트용 TypeScript 데이터 생성
3. SQL Connect 시드 생성
4. 생성 결과와 CSV의 일치 여부 및 사이트 데이터 검사
5. 검사가 끝난 전체 비공개 데이터를 날짜별로 자동 백업

검사만 할 때는 `npm run catalog:source-check`, 생성 데이터와의 일치 여부까지 확인할 때는 `npm run catalog:check`를 사용합니다.

`npm run catalog:export`는 기존 사이트 데이터를 CSV로 다시 내보내는 초기화·복구용 명령입니다. 사람이 CSV를 수정한 뒤에는 수정 내용이 덮어써질 수 있으므로 사용하지 않습니다.
