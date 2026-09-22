# 비공개 제품 데이터 관리

제품 카탈로그 원본과 생성 파일은 Git에서 제외하며 로컬에서 관리합니다.

## 백업

```bash
npm run data:backup
```

`private-backups/<날짜시간>/`에 원본 경로 구조대로 복사하고 `manifest.json`에 파일 크기와 SHA-256 해시를 기록합니다. `private-backups/`는 Git에 포함되지 않습니다.

다른 디스크나 동기화 폴더에 저장하려면 PowerShell에서 백업 경로를 지정한 뒤 실행합니다.

```powershell
$env:MODELFIT_PRIVATE_BACKUP_DIR = 'D:\ModelFit-Backup'
npm run data:backup
```

## 무결성 검사

```bash
npm run data:backup:verify
```

가장 최근 백업의 모든 파일을 해시로 검사합니다.

## 복구

```bash
npm run data:restore -- --from latest --force
```

복구 전에 백업 무결성을 확인하며, `--force`가 없으면 기존 로컬 데이터를 덮어쓰지 않습니다. 특정 백업은 `latest` 대신 백업 폴더 이름을 지정합니다.

백업 폴더도 같은 컴퓨터에만 있으면 디스크 고장에 대비할 수 없습니다. `private-backups/`를 암호화된 외장 저장장치나 비공개 클라우드 저장소에 별도로 복사해야 합니다.
