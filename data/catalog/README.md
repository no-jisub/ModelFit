# 관계형 CSV 카탈로그

이 폴더는 현재 사이트 데이터를 나중에 PostgreSQL로 옮길 수 있도록 관계형 테이블 형태로 나눈 CSV입니다. 모든 파일은 Excel에서 한글이 깨지지 않도록 UTF-8 BOM으로 저장합니다.

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

이 폴더와 `../import/models.csv`가 카탈로그의 원본 데이터입니다. CSV를 수정한 뒤 `npm run catalog:import`를 실행하면 사이트용 TypeScript 파일이 다시 생성됩니다. `npm run catalog:check`는 기본키 중복, 참조 누락, URL 형식과 생성 데이터 일치 여부를 검사합니다.

`npm run catalog:export`는 기존 사이트 데이터를 CSV로 다시 내보내는 초기화·복구용 명령입니다. 사람이 CSV를 수정한 뒤에는 이 명령을 실행하면 수정 내용이 덮어써질 수 있으므로 사용하지 않습니다.
