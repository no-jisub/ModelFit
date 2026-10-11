# 구매 가격 운영

쿠팡 검색 API의 `productPrice`를 상품의 조회 가격으로 표시한다. 최종 결제 금액·배송비·쿠폰가는 구매처에서 확인한다. 공식몰 가격은 API 가격과 섞지 않는다.

- CSV `purchase-links.csv`의 `priceKeyword`, `priceProductId`, `priceItemId`, `priceVendorItemId`로 수집 대상을 설정한다. 상품·옵션·판매자 ID를 모두 지정해야 한다.
- `npm run sync:purchase-prices`가 서버에서 HMAC 인증을 수행한다. 브라우저에서는 API를 호출하지 않는다.
- 정확한 세 ID가 일치하는 결과만 기록한다. 검색 상위 10개에서 찾지 못했다고 판매 종료로 판단하지 않는다.
- API 실패·검색 누락·키 누락 시 이전 가격을 재사용하지 않고 가격을 숨긴다. 구매 버튼은 유지한다.
- GitHub 배포 워크플로가 main 푸시·수동 실행·6시간 간격 예약 실행 시 수집하고 재배포한다. 예약 실행은 GitHub 상황에 따라 지연될 수 있다.
- 화면에는 조회 날짜를 표시하지 않으며, 수집 시각은 스냅샷에 보관한다. 24시간 지난 가격은 빌드와 브라우저 양쪽에서 숨긴다. 탭 재방문·열린 페이지에서도 만료를 확인한다. 24시간은 사이트의 표시 상한이며 쿠팡이 보장한 캐시 허용 기간이 아니다.
- 제공받은 `/products/search` 문서의 제한은 분당 50회·응답 최대 10개다. 요청 사이에 2초 간격을 둔다. Reco API의 노출 추적·개인화 캐시 규칙을 검색 API 규칙으로 혼용하지 않는다. 정책 변경 시 수집·표시 상한을 재검토한다.
- `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`는 GitHub Secrets와 로컬 `.env`에만 보관한다. 생성 가격은 ignored `outputs/purchase-prices.json`에 기록하며 원본 API 응답·키를 배포하지 않는다.

상품 URL을 변경하면 기존 가격은 URL 일치 검사로 숨겨진다. 새 상품의 세 ID를 검증한 뒤 CSV와 CI 카탈로그 Secrets를 함께 갱신한다.

요청 실패 시에도 다음 요청 시작까지 최소 2초 간격을 유지한다. 같은 실행에서 성공한 검색 결과는 검색어별로 공유해 중복 호출을 줄인다. 여러 부품이 같은 판매 상품을 공유하더라도 각 구매 링크의 세 ID를 따로 대조한다.

## 자동 갱신과 배포

기존 Build and deploy 워크플로를 사용한다. 별도 중복 스케줄은 만들지 않는다.
한국 시간 03:23, 09:23, 15:23, 21:23에 실행 예약되어 있으며 GitHub 사정에 따라 지연될 수 있다.
main 푸시 또는 Actions에서 수동 실행할 때도 가격을 갱신한다.

1. 비공개 CSV를 Secrets에서 복원한다.
2. 등록된 쿠팡 가격 대상 검색어를 조회한다. 방문자가 페이지를 열 때 호출하지 않는다.
3. productId, itemId, vendorItemId가 모두 일치하는 상품 가격만 저장한다.
4. 검증과 빌드를 통과하면 Firebase Hosting에 배포한다.

### 설정

GitHub 저장소의 Settings → Secrets and variables → Actions에 아래 Secrets가 필요하다.
키 값은 코드나 로그에 출력하지 않는다.

- COUPANG_ACCESS_KEY
- COUPANG_SECRET_KEY
- MODELFIT_CATALOG_GZIP_1, MODELFIT_CATALOG_GZIP_2, MODELFIT_CATALOG_GZIP_3
- FIREBASE_SERVICE_ACCOUNT_MODELFIT_KR

기존 PUBLIC_* 변수와 FIREBASE_PROJECT_ID도 배포 설정대로 유지한다.
수집 결과는 Actions 실행 요약과 purchase-price-status 아티팩트에 남긴다.

### 실패 처리와 표시

- 키 누락, 인증 오류, HTTP 429는 실패로 처리해 자동 배포를 중단한다.
- 같은 검색어는 실행당 한 번 조회하며, 실패한 검색어도 반복 조회하지 않는다.
- 계정 전체 API 할당량을 보장하는 설정은 아니다. 다른 API 작업과 할당량을 공유할 수 있다.
- 일부 상품을 찾지 못하면 해당 가격을 숨기고 확인된 가격만 배포한다.
- 수집 실패 가격은 이전 값으로 이월하지 않는다.
- 24시간 지난 가격은 기존 로직에 따라 숨긴다. 구매 링크는 유지한다.
- 국내 공식몰도 `npm run sync:official-prices`로 수집한다. 단일 상품의 원화 판매가가 구조화 데이터에 명확히 표시된 경우만 사용한다.
- LG 공식몰은 회원할인가 조건을 함께 표시한다. 외화, 여러 옵션 가격, 가격 범위, 품절 상품은 표시하지 않는다.
- 공식몰 수집 파일은 쿠팡 파일과 별도로 저장해 서로 덮어쓰지 않는다. 같은 24시간 만료 기준을 적용한다.

로컬 대상 확인(API 호출과 파일 변경 없음): `npm run sync:purchase-prices -- --dry-run`
로컬 실제 갱신: `npm run sync:purchase-prices`
공식몰 갱신: `npm run sync:official-prices`
로컬 갱신 결과를 정적 사이트에 반영하려면 다시 빌드해야 한다.

코드 작성만으로 GitHub 스케줄이 활성화되지는 않는다.
main에 반영하고 필요한 Secrets를 등록한 다음 Actions 실행과 배포 성공을 확인해야 한다.
