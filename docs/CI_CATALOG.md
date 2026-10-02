# CI 비공개 카탈로그 공급

CI는 GitHub Actions Repository Secrets 두 개에서 비공개 CSV를 복원한 다음 생성 데이터를 새로 만듭니다. 원본 CSV와 생성 TypeScript는 계속 Git에서 제외합니다. 환경변수, 인증 키, 백업 파일은 패키지에 포함하지 않습니다.

## 최초 설정과 데이터 갱신

1. 로컬에서 원본 CSV를 검토하고 `npm run catalog:import`, `npm run catalog:check`, `npm run validate:data`를 통과시킵니다.
2. `npm run catalog:ci:pack`을 실행합니다. Git에서 제외된 `outputs/catalog-ci-1.txt`, `outputs/catalog-ci-2.txt`를 만듭니다.
3. 저장소의 Settings → Secrets and variables → Actions에서 두 파일의 내용을 각각 `MODELFIT_CATALOG_GZIP_1`, `MODELFIT_CATALOG_GZIP_2` Repository Secret으로 등록합니다. 두 Secret은 같은 패키지에서 나온 쌍으로 갱신해야 합니다.
4. 승인된 소스를 push한 뒤 CI 데이터 검증과 빌드 결과를 확인합니다. main push는 기존 워크플로에 따라 검증 후 운영 배포되므로 배포 승인을 먼저 확인합니다.

인증된 GitHub CLI에서는 아래 명령으로 등록할 수 있습니다. 데이터 내용은 콘솔에 출력하지 않습니다.

```powershell
Get-Content -LiteralPath outputs/catalog-ci-1.txt -Raw | gh secret set MODELFIT_CATALOG_GZIP_1 --repo no-jisub/ModelFit
Get-Content -LiteralPath outputs/catalog-ci-2.txt -Raw | gh secret set MODELFIT_CATALOG_GZIP_2 --repo no-jisub/ModelFit
```

## 복원과 검증

배포, 브라우저 품질 검사, 주간 링크 감사 워크플로 모두 npm ci 후 Secret 복원과 catalog:import를 실행합니다. 브랜드·카테고리 메타데이터, 모델, 소모품 데이터는 CSV에서 생성하며 SQL Connect 시드는 database:check에서 생성합니다.

복원은 지정된 v2 원본 CSV 18개만 허용하고, 경로 추가·파일 누락·손상·알 수 없는 버전은 실패 처리합니다. 복원 Secret은 해당 단계에만 전달하고 패키지 내용은 로그에 출력하지 않습니다. 한 Secret은 최대 45,000 ASCII bytes로 제한합니다. 압축 인코딩이 90,000 bytes를 넘는 규모에서는 별도 비공개 데이터 저장소로 전환합니다.

현재 원본 전체를 대상으로 검사하는 테스트이므로 Secret을 받을 수 없는 fork PR은 해당 CI job을 건너뜁니다. fork 코드를 pull_request_target으로 실행하지 않습니다. 동일 저장소 PR, main push, 예약 감사는 Repository Secrets가 있어야 성공합니다.

로컬 변경 후 Secret을 갱신하지 않으면 CI는 이전 카탈로그 스냅샷을 사용합니다. 카탈로그 갱신과 Secret 갱신을 한 작업으로 처리하세요. 등록 전에는 워크플로 구현이 끝났더라도 원격 CI 데이터 공급은 완료된 상태가 아닙니다.

전송 포맷은 version=2입니다. v1 패키지는 거부합니다. 현재 v2 패키지는 Secret별 40,120 bytes입니다. Secret 등록은 CSV 보완 후로 보류 중이며 아직 업로드하지 않았습니다.
