# 모델핏 출시 점검 — 2026-09-06

## 현재 결과

로컬 구현과 자동 검사를 정리했다. 운영 배포와 실제 관리자 로그인·제보 접수까지 완료된 상태는 아니다.
사진 추가와 사이트 전체의 동적 전환은 보류한다.

- 카탈로그: 브랜드 16, 모델 80, 소모품 165.
- 위닉스 제로 S: 마이크로 집진필터 CAF-I0H3와 탈취필터 CAF-I0D1을 분리. 세척 금지와 6~12개월 주기를 반영. 프리필터 청소와 교체 필터를 구분.
- 웰스: AL106 3종, 토네이도 AN730/AN734 3종, AQ107 4종으로 구성 구분. AQ107 생활맞춤형은 선택 필터로 명시. 공식 안내에 주기가 없는 부품은 추정하지 않음.
- 코웨이 AP-2219K: 탈취필터와 초미세먼지 집진필터가 결합된 일체형 복합필터 한 개로 유지. 설명서 기준 교체 주기와 사용 조건을 반영.
- 쿠쿠: ACF-WMT10·ACF-TMT20의 공식 상품 페이지를 직접 연결. ACF-TMT20의 약 1년 교체 안내와 세척 재사용하는 프리필터 구분을 반영.
- 에브리봇: 걸레 이름과 판매 수량을 분리. 부품명에는 종류만 표시하고 2장·3장은 판매 구성 설명에 유지.
- SK매직 ACL20: 실제 교체품은 FLTA20C2ATWH 올인원플러스 일체형 필터 한 개로 확인. 공식 상품의 12개월 주기와 부품번호를 반영.
- 사라진 세트 소모품 주소 3개는 해당 모델로 이동하도록 유지.
- 쿠팡 검색 URL을 생성하던 기본 동작을 중단. 상품 URL이 없으면 공식 근거만 제공.
- 공식 호환 정보가 외부 판매자의 진품 보증으로 읽히지 않도록 설명 수정.
- 드롭다운, 모바일 화면, 오래된 E2E 선택자, 홈 탭 글자 대비 정리.
- 배포 워크플로에서 전체 검사 → 취약점 → 브라우저 검사를 모두 통과해야 Hosting 배포.
- 제보 양식이 비활성화됐을 때 이메일 제보 경로 제공. 양식과 이메일의 수집 정보 차이 명시.

## 검증과 범위

- `npm run check`: 통과. 단위 테스트 67개, Firestore Emulator 허용·거부 테스트 6개, Astro 진단 0개.
- E2E: 데스크톱·모바일·접근성·성능 74개 통과. 실제 휴대폰 검사나 실제 계정 로그인 검사는 아님.
- 빌드: 279개 정적 페이지(이전 주소 이동 포함).
- `npm audit --audit-level=high`: 취약점 0건.
- 확인일 검사: 모델·소모품 245개 중 재확인 예정/필요 0개. 저장된 날짜 기준 검사이며, 이번에 245개 제품 내용을 모두 재검증했다는 뜻은 아님.
- 링크 접근 감사: 113개 중 104개 정상 응답, 쿠팡 9개 HTTP 403, 기타 실패 0개. 정상 HTTP 응답도 개별 모델 호환성이나 상품 진품을 보증하지 않음.
- GitHub 운영용 공개 설정 7개를 적용한 전체 check와 E2E 74개도 통과. App Check 키는 없는 실제 운영 상태를 재현했다. 운영 계정 로그인이나 실제 접수 성공을 뜻하지 않는다.
- 로그: `outputs/release-check.log`, `outputs/release-e2e.json`, `outputs/release-source-audit.log`, `outputs/release-production-check.log`, `outputs/release-production-e2e.json`. outputs는 Git 제외.

## 확인한 공식 근거

- [위닉스 제로 S 집진필터](https://www.winix.com/product/4): CAF-I0H3.
- [위닉스 제로 S 탈취필터](https://www.winix.com/product/2): CAF-I0D1.
- [위닉스 AZSE430 설명서](https://cdn.winix.com/uploadData/manual/3609084973/818120381773378.pdf): 16~22쪽 필터 분리, 청소, 교체 주기.
- [웰스 AL106](https://m.kyowonwells.com/Product/Detail?grpIdx=47&productIdx=49): 상세스펙 및 가격·관리 안내 원문에서 필터 구성과 교체 주기 확인.
- [웰스 토네이도](https://m.kyowonwells.com/Product/Detail?grpIdx=182&productIdx=373): AN730/AN734 구성과 교체 주기.
- [웰스 AQ107](https://www.kyowonwells.com/Product/Detail?grpIdx=1394&productIdx=926): 생활맞춤형은 옵션. 프리 12개월·생활맞춤형 3개월. 탈취·HEPA 주기 미기재.
- [코웨이 AP-2219K 설명서](https://www.coway.com/core/product/fmanual/download/122): 탈취와 집진 기능이 결합된 일체형 복합필터, 12개월 교체 주기, 프리필터 세척 관리를 확인. 개별 부품번호는 확인되지 않아 구매 링크를 추가하지 않음.
- [코웨이 공식 필터·소모품 목록](https://www.coway.com/product/filters-supplies/all/all): AP-1818C·AP-2219K 전용 일체형 복합필터 확인.
- [쿠쿠 ACF-WMT10 공식 상품](https://www.cuckoo.co.kr/mall/productView?productNo=4547): AC-24W·AC-25W·W70 적용 모델 확인.
- [쿠쿠 ACF-TMT20 공식 상품](https://www.cuckoo.co.kr/mall/productView?productNo=4623): AC-T 계열 적용 필터 확인.
- [SK매직 ACL20 공식 필터 상품](https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000066078): FLTA20C2ATWH, ACL20C1ASKWH 호환, 12개월 교체 주기를 확인.

## 사람이 확인해야 하는 구매 링크

403 응답은 품절이나 상품 오류를 뜻하지 않는다. 기존 링크를 유지했으며 확인일을 오늘로 바꾸지 않았다.
판매 페이지의 부품번호, 적용 모델, 판매자, 정품/호환 표기, 구성 수량을 확인해야 한다.

- LG M 필터: https://link.coupang.com/a/gDwSqU3CAC
- LG G 필터: https://www.coupang.com/vp/products/8941845170
- LG 극세필터: https://link.coupang.com/a/gDv010uXdc
- 쿠쿠 ACF-WMT10: https://link.coupang.com/a/gle6sSgGOa
- 쿠쿠 ACF-TMT20: https://link.coupang.com/a/gle76e3jKC
- 위닉스 타워 엣지: https://www.coupang.com/vp/products/7368403017
- 위닉스 타워 프라임: https://www.coupang.com/vp/products/8692963466
- SK매직 ACL20 올인원 케어필터: https://www.coupang.com/vp/products/8673596944
- SK매직 ACL25 올인원 케어필터: https://www.coupang.com/vp/products/8785883201

LG G 필터의 보류된 파트너스 URL은 이번에도 임의 반영하지 않았다.

## 운영 미완료 항목

1. GitHub 운영 변수에 `PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`가 없다. 현재 웹 제보 양식은 접수 비활성화이며 이메일 링크가 대체 경로다.
2. reCAPTCHA Enterprise 사이트 키를 생성/연결하고 정상 요청을 확인한 뒤 Firestore App Check 강제 적용을 확인해야 한다. 키 존재와 강제 적용은 별개다.
3. 관리자 Google 로그인, `modelfit-reports`의 관리자 권한, 실제 시험 제보 접수·상태 변경은 운영 계정으로 확인해야 한다. Emulator 통과로 대체할 수 없다.
4. 운영 배포 승인 전 변경 내역을 검토한다. 승인 후 동일한 검증 소스로 배포하고 검색 → 모델 → 소모품 → 구매 링크 및 제휴 고지를 운영 사이트에서 확인한다.
5. 실제 이메일 수신은 아직 시험하지 않았다. 메일 전송 없이 링크와 안내만 검사했다.

## 유지할 원칙

검증되지 않은 판매 상품이나 부품번호를 채워 넣지 않는다. 모든 쿠팡 링크 아래 기존 파트너스 고지를 유지한다.
기존 작업을 덮어쓰지 말고, 커밋과 배포 여부는 사용자와 합의한 범위에 맞춰 진행한다.
