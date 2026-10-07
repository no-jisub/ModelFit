# CI 비공개 카탈로그 공급

CI는 GitHub Actions Repository Secrets에서 비공개 CSV를 복원한 다음 런타임 데이터를 생성합니다. 원본 CSV와 생성 TypeScript는 Git에서 제외합니다. 환경변수, 인증 키, 백업 파일은 패키지에 포함하지 않습니다.

## 데이터 갱신

1. 원본 CSV를 검토하고 `npm run catalog:update`를 통과시킵니다.
2. `npm run catalog:ci:pack`을 실행합니다. 패키지 크기에 따라 `outputs/catalog-ci-1.txt`, `outputs/catalog-ci-2.txt`, 필요하면 `outputs/catalog-ci-3.txt`를 생성합니다.
3. 생성된 파일을 같은 패키지의 `MODELFIT_CATALOG_GZIP_1`, `MODELFIT_CATALOG_GZIP_2`, `MODELFIT_CATALOG_GZIP_3` Repository Secret에 등록합니다. 아래 명령은 데이터 내용을 콘솔에 출력하지 않습니다.
4. 데이터 버전 파일과 코드를 함께 커밋하고 push합니다. main push는 검증 후 운영 Hosting 배포를 실행합니다.

```powershell
Get-Content -LiteralPath outputs/catalog-ci-1.txt -Raw | gh secret set MODELFIT_CATALOG_GZIP_1 --repo no-jisub/ModelFit
Get-Content -LiteralPath outputs/catalog-ci-2.txt -Raw | gh secret set MODELFIT_CATALOG_GZIP_2 --repo no-jisub/ModelFit
# 세 번째 파일이 생성된 패키지에서 실행합니다.
Get-Content -LiteralPath outputs/catalog-ci-3.txt -Raw | gh secret set MODELFIT_CATALOG_GZIP_3 --repo no-jisub/ModelFit
```

두 파일 패키지로 돌아갈 때는 기존 `MODELFIT_CATALOG_GZIP_3` Secret을 삭제합니다. 서로 다른 패키지 조각을 섞으면 복원 또는 SHA-256 검증이 실패합니다.

## 복원과 검증

배포, 브라우저 품질 검사, 주간 링크 감사 워크플로는 npm ci 후 Secret 복원과 catalog:import를 실행합니다. 모델·소모품·이미지 데이터는 CSV에서 생성하고 SQL Connect 시드는 database:check에서 생성합니다.

복원은 v2 원본 CSV 18개만 허용합니다. 경로 추가, 파일 누락, 손상, 버전 불일치는 실패 처리합니다. Secret은 복원 단계에만 전달하며 패키지 내용을 로그에 출력하지 않습니다. 한 Secret은 최대 45,000 ASCII bytes, 패키지는 최대 3개 조각으로 제한합니다. 총 135,000 bytes를 넘으면 별도 비공개 데이터 저장소로 전환해야 합니다.

기존 두 조각 패키지도 계속 지원합니다. 세 조각 패키지는 세 파일을 모두 등록해야 합니다. 카탈로그 변경, Secret 갱신, `data/catalog-version.json` 갱신을 함께 처리하세요.

Secret을 받을 수 없는 fork PR은 해당 CI job을 건너뜁니다. fork 코드를 pull_request_target으로 실행하지 않습니다.
