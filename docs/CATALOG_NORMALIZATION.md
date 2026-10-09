# 카탈로그 v2 정규화

2026-10-02 원본 CSV를 v2로 전환했습니다. 비공개 데이터와 CI 패키지는 로컬에 있으며, GitHub Secret 등록은 CSV 보완 후 진행합니다.

| 단계         | 결과                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| 1. 백업      | SHA-256 백업과 이전 화면 데이터 기준 확보                                                                     |
| 2. 계약      | catalog-schema.ts에 CSV 19개 헤더·키·참조 정의                                                                |
| 3. 이전      | 모의 실행 후 적용, 불명확한 값은 review-v2.json에 보존                                                        |
| 4. 검증·생성 | 원본 검증, 화면 생성, SQL 시드가 공통 계약 사용; 생성 파일 없이 원본 검증 가능                                |
| 5. 소비 코드 | 관계별 호환 상태, 구조화된 관리·수량, 옵션 소유 링크 적용; 레거시 필드 제거                                   |
| 6. SQL       | 19개 테이블·조회·시드 수정과 정적 검사 완료. 공식 컴파일·SDK 재생성·에뮬레이터는 Windows 실행 정책으로 미완료 |
| 7. 보존·CI   | ID·URL·표시 내용 비교 통과, v2 패키지 생성. Secret 업로드 보류                                                |

## 필드 이전

원본은 data/catalog/*.csv 한 곳에 있습니다. models.csv는 id와 slug를 명시적으로 보존합니다. status=published 모델만 공개하며 verificationStatus는 공개 상태와 별개입니다.

| v1                                          | v2                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| 브랜드 카테고리·도메인 목록                 | brand-categories.csv, brand-domains.csv                                    |
| data/import/models.csv의 별칭과 인라인 출처 | models.csv, model-aliases.csv, model-sources.csv                           |
| entity-sources.csv의 entityType/entityId    | 모델·부품·옵션·호환 관계별 출처 테이블                                     |
| 호환 연결에서 유실되던 확인 상태·날짜       | model-consumables.csv의 verificationStatus, verifiedAt, evidenceScope      |
| 부품과 옵션에 중복된 구매 링크              | purchase-links.csv는 productOptionId만 소유; Consumable.purchaseLinks 제거 |
| 공식 안내를 구매 링크로 취급                | guidance-links.csv로 분리; 구매 클릭 이벤트 제외                           |
| 옵션 partNumber                             | itemCode; 정품 부품번호로 추정하지 않음                                    |
| replacementInterval와 경고 문장 분석        | maintenanceMode, maintenanceDetail                                         |
| 모델별 수량·구성 문장 분석                  | 구조화된 관계 필드와 option-model-labels.csv                               |
| isDemo, consumableNote, modelNumberLocation | 제거; 모델 status와 기본 라벨 안내 사용                                    |

키워드는 속성이 없는 검색용 목록이므로 배열로 유지합니다. 화면 DTO의 brandName, consumableIds, compatibleModelIds는 관계에서 파생합니다. catalog:export는 DTO를 역변환하지 않고 검증된 원본 사본을 outputs/catalog-export에 내보냅니다.

## 검토 목록

- 정규화 직후 호환 관계 231개는 legacy-unscoped였고 관계별 출처가 없었습니다. 이후 수동 검토로 99개를 공식·scoped로 전환하고 109개 출처 연결을 추가했습니다. 나머지 132개는 근거 부족 또는 자료 충돌로 미확인입니다. 상세 기준과 적용 절차는 [호환 근거 검토](COMPATIBILITY_REVIEW.md)를 참고하세요.
- 정품 부품번호와 다른 옵션 코드 72개는 itemCode로 유지했습니다. SKU·상품 구성 코드 여부는 자료로 확인해야 합니다.
- 기존 화면에서 해석하던 수량·관리 텍스트를 구조화했습니다. 숫자 수량이나 새 근거를 추정하지 않았으며 검토 목록에 포함했습니다.
- 같은 URL의 출처도 기존 ID·제목·확인일을 유지합니다. 확인일 수정이 ID를 바꾸지 않습니다. 링크 확인일과 호환 검증일은 별개입니다.

상세 검토 목록은 비공개 outputs/normalization/review-v2.json입니다.

## 재현과 복구

변경 전 백업: private-backups/2026-10-02T13-03-34-165Z.
비교 기준: outputs/normalization/v1-baseline.json.
마이그레이션은 백업 전체 해시를 확인하며 기본은 모의 실행입니다.

```powershell
npm run catalog:migrate:v2 -- --from private-backups/2026-10-02T13-03-34-165Z
# 현재는 이미 v2입니다. 동일 기준으로 재현할 때만 --apply 사용
npm run catalog:migration:check -- --from private-backups/2026-10-02T13-03-34-165Z
npm run catalog:source-check
npm run catalog:import
npm run catalog:check
npm run check
npm run test:e2e
npm run catalog:ci:pack
```

v1 복구는 CSV뿐 아니라 v1 생성기·타입·화면 코드를 함께 복원해야 합니다. SQL 스키마는 운영에 배포하지 않았습니다. 기존 DB에 업서트만 하면 삭제된 구형 링크가 남을 수 있으므로 운영 이전에는 별도 데이터/스키마 마이그레이션과 롤백 검토가 필요합니다.

## SQL 검증 대기

dataconnect-emulator-3.4.18.exe가 Windows 애플리케이션 제어 정책에 차단되어 공식 컴파일과 SDK 재생성을 실행하지 못했습니다. SDK는 이전 버전이며 v2 SQL 계약과 일치한다고 보증할 수 없습니다. CSV 정적 사이트는 v2 데이터로 빌드됩니다. SQL 활성화 전에 허용된 환경에서 다음을 통과해야 합니다.

```powershell
npm run database:compile
npm run database:sdk
npm run database:local:test
```

타입 선언만 수정해 재생성된 것처럼 처리하지 않았습니다. 운영 데이터 업로드·클라우드 배포는 수행하지 않았습니다.

## 정규화 직후 검증 결과

- 단위 테스트 116개, Firestore 규칙 테스트 6개, 브라우저 테스트 112개 통과.
- 형식·린트·원본/생성 데이터 검사·SQL 정적 검사·사이트 빌드 통과. 291개 페이지 생성.
- 비공개 원본과 생성 파일이 없는 별도 체크아웃에서 v2 패키지 복원 → 원본 검사 → 데이터 생성 → 사이트 빌드 통과.
- 변경 전 기준과 모델 80개·부품 177개·관계 231개·옵션 316개·링크 326개 보존 비교 통과.
- v2 백업 private-backups/2026-10-02T13-40-18-523Z의 22개 파일 해시 검증 통과.
- 검토 목록은 관계 출처 231건, 옵션 코드 72건, 관리 정보 63건, 수량/구성 정보 220건입니다. 중복 검토 범주이며 검증 상태를 자동 변경하지 않습니다.
- CI 패키지는 Secret별 40,120 bytes입니다. 업로드하지 않았습니다.
