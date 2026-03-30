# AdStream

AdStream은 외부 사이트가 붙여 쓸 수 있는 pause 광고 플레이어 SaaS MVP입니다.

## 프로젝트 구조

- `apps/admin-app`: React + Vite 관리자 대시보드
- `apps/api-server`: Express + Prisma + SQLite API 서버
- `packages/player-sdk`: script 태그로 삽입 가능한 플레이어 SDK

## 기술 결정

- DB는 로컬 실행이 쉬운 `SQLite`
- ORM은 `Prisma`
- 인증은 `JWT`
- SDK는 `tsup`으로 IIFE 번들 생성 후 `AdStreamPlayer` 전역 객체로 제공

## 주요 기능

- 이메일/비밀번호 회원가입, 로그인
- 사이트 등록 및 `siteId` 발급
- 광고 등록
- pause 광고 SDK
- 노출/클릭 수집
- 예상 수익 리포트
- demo page

## 로컬 실행

1. 루트에서 의존성 설치

```bash
npm install
```

2. 환경 변수 생성

```bash
cp .env.example apps/api-server/.env
cp .env.example apps/admin-app/.env
```

또는 루트 `.env` 기준으로 직접 맞춰도 됩니다.

3. Prisma generate / migrate / seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. SDK 빌드

```bash
npm run build -w @adstream/player-sdk
```

5. API 서버 실행

```bash
npm run dev:api
```

6. 관리자 앱 실행

```bash
npm run dev:admin
```

## 기본 계정

- 이메일: `gggum999@gmail.com`
- 비밀번호: `Lee50925092@`

## 주요 테스트 흐름

1. 로그인
2. 사이트 등록 또는 seed 사이트 사용
3. 광고 등록
4. Demo 페이지 이동
5. 영상 재생 후 10초 이상 시청
6. pause
7. 광고 오버레이 노출
8. 클릭/노출 로그가 리포트에 집계

## SDK 사용 예시

```html
<script src="http://localhost:4000/sdk/adstream-player.js"></script>
<div id="adstream-player"></div>
<script>
  AdStreamPlayer.init({
    containerId: "adstream-player",
    siteId: "site_demo_adstream",
    videoUrl: "https://examplefiles.org/files/video/mp4-example-video-download-640x480.mp4",
    posterUrl: "https://dummyimage.com/640x480/0f172a/ffffff&text=AdStream+Demo+4:3",
    title: "Sample Video",
    apiBaseUrl: "http://localhost:4000"
  });
</script>
```
