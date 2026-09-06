# 모델핏 운영 체크리스트

## 현재 구조

카탈로그는 Astro 정적 페이지, 제보는 Firebase `modelfit-reports` 데이터베이스로 운영한다.
데이터·검사 수치와 미완료 사항은 [출시 점검](RELEASE_REVIEW.md)을 참고한다.

## 배포 설정

GitHub Repository variables에는 `.env.example`의 공개 웹 설정을 등록한다.
필수 배포 변수는 `FIREBASE_PROJECT_ID`, `PUBLIC_SITE_URL`, `PUBLIC_SITE_NAME`이다.
제보 기능에는 `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`,
`PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_APP_ID`, `PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`가 필요하다.
발신자 ID는 선택이다. 공개 운영 이메일은 `PUBLIC_REPORT_EMAIL`, 분석은 `PUBLIC_GA_MEASUREMENT_ID`로 설정한다.

`PUBLIC_` 값은 브라우저에 공개된다. 서비스 계정 JSON은 Repository secret
`FIREBASE_SERVICE_ACCOUNT_MODELFIT_KR`에만 보관하며 저장소·공개 변수에 넣지 않는다.
현재 쿠팡 카탈로그는 직접 상품 링크만 사용하고 `PUBLIC_COUPANG_BASE_URL`은 사용하지 않는다.

## 배포 전

1. Java 21 이상으로 `JAVA_HOME`과 PATH를 지정한다.
2. `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit --audit-level=high`를 통과시킨다.
3. `npm run audit:freshness`, `npm run audit:sources`를 확인한다. 링크 접근 성공과 상품 내용 검증은 별개다.
4. 공식 자료에 없는 부품번호·주기·등급을 쓰지 않았는지 확인한다. 판매 링크 아래 파트너스 고지를 유지한다.
5. 현재 Git diff를 검토하고 배포 승인을 확인한다.

`main` push의 배포 워크플로는 전체 검사, 취약점 검사, 브라우저 검사가 모두 성공한 경우에만
Hosting을 배포한다. Firestore 규칙은 이 Hosting 배포에 포함되지 않는다.
`quality.yml`은 공개 운영 변수가 없는 환경을 별도로 검사한다.

## 제보·관리자 기능 개시

1. `firebase.json`의 데이터베이스 이름 `modelfit-reports`, Enterprise edition, 위치 `asia-northeast3`를 확인한다.
2. Firebase Authentication에서 Google 제공업체와 운영 도메인을 설정한다.
3. reCAPTCHA Enterprise 웹 키에 운영 도메인을 등록하고 Firebase 웹 앱의 App Check에 연결한다.
4. GitHub 변수 `PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`에 공개 사이트 키를 등록하고 사이트를 다시 빌드·배포한다.
5. 정상 App Check 요청 지표를 확인한 뒤 Cloud Firestore 강제 적용 여부를 확인한다. 사이트 키만으로 강제 적용이 증명되지는 않는다.
6. 규칙 수정이 있으면 Emulator 허용·거부 검사를 통과한 후 별도로 `firebase deploy --only firestore:rules --project modelfit-kr`를 실행한다.
7. `/admin`에서 관리자 Google 계정으로 로그인한다. 관리자가 지정한 UID의 `admins/{uid}` 문서에 `active: true`를 콘솔에서 부여한다. 클라이언트는 이 권한을 만들 수 없다.
8. 운영자 확인용 제보를 제출하고 목록 조회·상태 변경을 확인한다. 실제 테스트 제보임을 명시한다.

운영 키가 없으면 웹 양식은 비활성화한다. 이메일 대체 경로는 발신 이메일 주소도 운영자에게 전달됨을 안내한다.
서비스 계정이나 관리자 비밀번호를 프런트엔드에 넣지 않는다.

## 보관 관리

웹 제보는 관리자만 읽고 상태를 변경할 수 있다. 최근 100건까지 표시하며 클라이언트 삭제 기능은 없다.
`expiresAt`은 1년 뒤의 보관 만료일이다. TTL 자동 삭제가 아니라 운영자가 만료 데이터를 수동 정리해야 한다.
이메일 제보는 Firestore에 자동 저장되지 않으며 별도로 관리한다.

## 배포 후

- 운영 사이트에서 검색 → 모델 선택 → 소모품 → 구매 링크를 데스크톱과 모바일로 확인한다.
- 모든 쿠팡 링크 아래 고지와 새 창 열기 속성, canonical·robots·sitemap을 확인한다.
- 제보 양식 상태, 이메일 링크, 관리자 로그인을 확인한다.
- GitHub 배포와 브라우저 검사 결과를 확인하고 배포 커밋·시간·미완료 항목을 인수인계에 기록한다.

## 로컬 미리보기

기본 E2E 포트 4322가 사용 중이면 `$env:MODELFIT_E2E_PORT = '4324'`처럼 다른 포트를 사용한다.
다른 작업의 서버를 종료하지 않는다. 4321 미리보기는 `dist`를 제공하므로 소스 변경 후 다시 빌드한다.
미리보기 재시작 전 포트 소유 프로세스의 명령줄이 이 프로젝트의 Astro preview인지 확인한다.
