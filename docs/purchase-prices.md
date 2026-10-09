# 구매 가격 운영

쿠팡 검색 API의 `productPrice`를 상품의 조회 가격으로 표시한다. 최종 결제 금액·배송비·쿠폰가는 구매처에서 확인한다. 공식몰 가격은 API 가격과 섞지 않는다.

- CSV `purchase-links.csv`의 `priceKeyword`, `priceProductId`, `priceItemId`, `priceVendorItemId`로 수집 대상을 설정한다. 상품·옵션·판매자 ID를 모두 지정해야 한다.
- `npm run sync:purchase-prices`가 서버에서 HMAC 인증을 수행한다. 브라우저에서는 API를 호출하지 않는다.
- 정확한 세 ID가 일치하는 결과만 기록한다. 검색 상위 10개에서 찾지 못했다고 판매 종료로 판단하지 않는다.
- API 실패·검색 누락·키 누락 시 이전 가격을 재사용하지 않고 가격을 숨긴다. 구매 버튼은 유지한다.
- GitHub 배포 워크플로가 main 푸시·수동 실행·6시간 간격 예약 실행 시 수집하고 재배포한다. 예약 실행은 GitHub 상황에 따라 지연될 수 있다.
- 조회 시각을 표시하고 24시간 지난 가격은 빌드와 브라우저 양쪽에서 숨긴다. 탭 재방문·열린 페이지에서도 만료를 확인한다. 24시간은 사이트의 표시 상한이며 쿠팡이 보장한 캐시 허용 기간이 아니다.
- 제공받은 `/products/search` 문서의 제한은 분당 50회·응답 최대 10개다. 요청 사이에 2초 간격을 둔다. Reco API의 노출 추적·개인화 캐시 규칙을 검색 API 규칙으로 혼용하지 않는다. 정책 변경 시 수집·표시 상한을 재검토한다.
- `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`는 GitHub Secrets와 로컬 `.env`에만 보관한다. 생성 가격은 ignored `outputs/purchase-prices.json`에 기록하며 원본 API 응답·키를 배포하지 않는다.

상품 URL을 변경하면 기존 가격은 URL 일치 검사로 숨겨진다. 새 상품의 세 ID를 검증한 뒤 CSV와 CI 카탈로그 Secrets를 함께 갱신한다.
