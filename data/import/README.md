# 모델 CSV 등록

`models.csv`가 전체 모델의 원본입니다. Excel에서 열어 모델을 한 행씩 입력하거나 수정합니다. 카테고리와 브랜드별 빈 줄은 가독성을 위한 것이므로 유지해도 됩니다. 저장할 때 파일 형식은 **CSV UTF-8(쉼표로 분리)**을 선택합니다.

## 사용 순서

1. `data/import/models.csv`에 모델을 입력합니다.
2. 먼저 `npm run check:models-csv`로 오류를 확인합니다.
3. 오류가 없으면 `npm run import:models`로 사이트 데이터를 생성합니다.
4. 이미지와 소모품 연결 안내를 확인하고 해당 데이터를 추가합니다.
5. `npm run check`로 전체 검사 후 커밋합니다.

`status`가 `draft`인 행은 검증하지만 사이트에는 추가하지 않습니다. 공식 출처 확인이 끝난 행만 `published`로 변경합니다.

## 열 설명

| 열                 | 필수    | 내용                                                                           |
| ------------------ | ------- | ------------------------------------------------------------------------------ |
| `status`           | 예      | `draft` 또는 `published`                                                       |
| `category`         | 예      | `categories.ts`에 등록된 ID                                                    |
| `brandId`          | 예      | `brands.ts`에 등록된 ID                                                        |
| `modelName`        | 예      | 사용자에게 표시할 제품명                                                       |
| `modelCode`        | 예      | 제품의 정확한 모델번호                                                         |
| `series`           | 아니요  | 제품군 또는 시리즈명                                                           |
| `sourceUrl`        | 게시 시 | `https`로 시작하는 공식 출처                                                   |
| `sourceTitle`      | 게시 시 | 출처의 이름                                                                    |
| `sourceType`       | 게시 시 | `manufacturer`, `official-manual`, `official-store`, `seller`, `other` 중 하나 |
| `verifiedAt`       | 게시 시 | 확인 날짜 `YYYY-MM-DD`                                                         |
| `releaseDate`      | 아니요  | 출시일 `YYYY-MM-DD`                                                            |
| `releaseSourceUrl` | 아니요  | 출시일을 확인한 `https` 주소                                                   |
| `aliases`          | 아니요  | 추가 검색어를 `                                                                | `로 구분 |

예시:

```csv
published,robot-vacuum,roborock,Roborock Q Revo New,QR-NEW,Q Revo,https://example.com/product,Roborock 공식 제품 정보,manufacturer,2026-09-21,,,Q Revo New|로보락 신형
```

쉼표가 포함된 값은 Excel이 자동으로 큰따옴표로 감싸 저장합니다. 헤더 이름은 변경하지 마세요.
