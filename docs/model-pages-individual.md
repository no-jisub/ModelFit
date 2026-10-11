# 모델별 상세페이지 표시

2026-10-10: 제품명으로 묶던 카테고리·브랜드 카드를 모델별 카드로 변경하고 상세페이지의 모델번호 선택창을 제거했다. 기존 모델 URL과 소모품 호환 관계는 유지한다.

LG AS205NGJA, AS205NSJA, AS355NGNA, AS355NSNA, AS355NSAH의 제품명에 AI 오브제컬렉션과 색상을 반영했다. AS355NSAH는 알파UP를 구분한다. 다른 모델의 세부 색상은 추정해서 추가하지 않는다.

근거:

- [LG전자 2025년 5월 공식 카탈로그](https://www.lge.co.kr/kr/ebook/2025/may/mart/catImage/553/202505_mart_catalogue.pdf): 위 5개 모델의 샌드 베이지·네이처 그린 색상과 기본 필터 구성.
- [AS205NGJA 공식 제품 페이지](https://www.lge.co.kr/air-purifier/as205ngja): AI 오브제컬렉션 360° 제품명과 네이처 그린.
- [AS355NSAH 공식 제품 페이지](https://www.lge.co.kr/air-purifier/as355nsah): AI 오브제컬렉션 360° 알파UP 제품명.

LG 사이트의 일부 현재 판매 페이지는 베이지 색상을 카밍 베이지로 표기한다. 이 작업에서는 사용자가 지정한 기존 모델의 공식 카탈로그 표기인 샌드 베이지를 사용했다.

실제 제품명은 비공개 원본 `data/catalog/models.csv`에 반영되므로 배포 시 갱신된 CI 데이터 패키지가 필요하다.
