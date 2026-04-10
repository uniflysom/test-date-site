# 회사 일정 뷰어 (Next.js)

공개 Google 스프레드시트를 CSV로 불러와 [DESIGN.md](./DESIGN.md)에 정의된 MiniMax 스타일 토큰으로 일정을 표시합니다.

## 요구 사항

- Node.js 20 이상 권장
- 스프레드시트는 **링크가 있는 모든 사용자** 또는 **웹에 공개** 수준으로 **읽기**가 가능해야 합니다.

## 설정

1. `.env.example`을 복사해 `.env.local`을 만듭니다.

   ```bash
   copy .env.example .env.local
   ```

2. `.env.local`에 스프레드시트 ID를 넣습니다. 예시:

   - URL: `https://docs.google.com/spreadsheets/d/1P--wtuvsTjwTc4ry_fk7GSQmgqqXL9QSUF0ZHNBtw24/edit?gid=0`
   - `SCHEDULE_SPREADSHEET_ID=1P--wtuvsTjwTc4ry_fk7GSQmgqqXL9QSUF0ZHNBtw24`
   - 특정 탭이면 URL의 `gid=` 값을 `SCHEDULE_SHEET_GID`에 넣습니다 (첫 탭은 보통 `0`).

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### localhost:3000이 안 열릴 때

1. **반드시 이 프로젝트 폴더(`test-design`)에서** `npm run dev`를 실행했는지 확인합니다. 다른 폴더에서 실행하면 주소가 뜨지 않습니다.
2. 터미널에 `✓ Ready`와 `Local: http://localhost:...`가 나온 뒤 브라우저로 접속합니다. **주소는 항상 터미널에 적힌 포트를 따릅니다.** 3000번 포트가 이미 쓰이면 Next.js가 **3001** 등으로 올립니다.
3. **첫 접속 직후** Turbopack이 페이지를 컴파일하는 동안 **10~30초** 걸릴 수 있습니다. 흰 화면이면 잠시 기다리거나 터미널에 `GET / 200`이 찍혔는지 확인합니다.
4. 주소는 **`http://`** 로 엽니다(`https://localhost:3000`은 동작하지 않습니다).
5. `localhost` 대신 [http://127.0.0.1:3000](http://127.0.0.1:3000)을 시도해 봅니다.
6. Windows에서 Node.js에 대한 **방화벽 허용** 창이 뜨면 허용합니다.
7. `node -v`로 **Node.js 20 이상**인지 확인합니다. 버전이 낮으면 `npm run dev`가 실패할 수 있습니다.

## 스프레드시트 형식

- **첫 행은 헤더**로 두고, 열 이름에 `날짜`, `시간`, `제목`, `장소`, `내용` 등이 포함되면 자동으로 매칭합니다.
- 헤더를 인식하지 못하면 **A열=날짜, B열=시간, C열=제목** 순으로 해석합니다.

## 배포 (예: Vercel)

프로젝트를 연 뒤 환경 변수에 `SCHEDULE_SPREADSHEET_ID`와 필요 시 `SCHEDULE_SHEET_GID`를 설정합니다.

## 데이터 갱신

서버에서 CSV를 가져올 때 **약 120초**마다 재검증(ISR)합니다. 트래픽이 많으면 Google 측 제한이 있을 수 있으니 간격을 조정하려면 `src/lib/schedule.ts`의 `REVALIDATE_SECONDS`를 변경하세요.
