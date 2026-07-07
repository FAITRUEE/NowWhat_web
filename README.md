# NowWhat — 할 일 우선순위 추천 서비스 (Frontend)

사용자의 할 일 목록을 마감일·중요도·소요시간 기준으로 분석해 오늘 무엇부터 해야 하는지 자동으로 추천해주는 개인 생산성 서비스의 프론트엔드입니다. [백엔드(NowWhat_was)](../NowWhat_was)와 함께 동작하도록 설계되었습니다.

## 현재 상태

화면은 대부분 만들어졌지만 **아직 백엔드와 연동되지 않은, 정적 데이터 기반의 UI**입니다.

| 화면 | 상태 |
|---|---|
| 로그인 (SC-01) / 회원가입 (SC-02) | UI + 클라이언트 측 유효성 검사(필수값, 이메일 형식, 비밀번호 일치)만 구현. 실제 `POST /api/auth/*` 호출 없음 |
| 메인 대시보드 (SC-03) | 우선순위 테이블, 긴급 항목/생산성 점수 카드, 할 일 추가 모달까지 구현. 단, 전부 `features/tasks/mock/dashboardMock.ts`의 정적 데이터 + 로컬 `useState` 기반이며 실제 API/react-query 연동 없음 |
| 이력 (SC-06) / 가중치 설정 (SC-07) | 빈 placeholder |

즉 지금 시점에서는 "백엔드 API 없이도 완결된 느낌으로 보이는 목업"에 가깝고, 다음 단계는 `features/tasks/api/taskApi.ts` 및 `types/task.ts`를 백엔드의 실제 요청/응답 형태(`TaskCreateRequest`/`TaskResponse` 등)에 맞춰 정리하고 react-query로 교체하는 작업입니다.

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 8 |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`), Material 3 스타일 커스텀 디자인 토큰 |
| 라우팅 | react-router-dom v7 |
| 서버 상태 (예정) | @tanstack/react-query |
| HTTP 클라이언트 | axios |
| 아이콘 / 폰트 | Material Symbols Outlined, Inter (Google Fonts) |
| 린트 | oxlint |

## 시작하기

```bash
npm install
npm run dev        # http://localhost:5173, /api 요청은 http://localhost:8080 으로 프록시 (vite.config.ts)
```

백엔드(`NowWhat_was`)를 `./gradlew bootRun`으로 함께 띄우면 `/api/*` 프록시가 정상 동작하지만, 위에서 설명한 대로 현재 화면들은 아직 그 API를 실제로 호출하지 않습니다.

```bash
npm run build       # tsc -b && vite build
npm run lint         # oxlint
npm run preview      # 프로덕션 빌드 미리보기
```

테스트 러너는 아직 설정되어 있지 않습니다.

## 프로젝트 구조

기능(feature) 기반 구조를 사용합니다.

```
src/
├── api/client.ts              # 공용 axios 인스턴스 — localStorage의 JWT 부착, 401 시 /login 리다이렉트
├── components/
│   ├── ui/                     # 범용 프레젠테이션 컴포넌트 (API 호출/비즈니스 로직 없음) — Icon, TextField
│   └── layout/                 # 페이지 뼈대 — MainLayout(Sidebar+Outlet), AuthLayout(로그인/회원가입 공용 배경), Sidebar, PageHeader
├── features/
│   ├── auth/components/         # LoginForm, SignupForm
│   └── tasks/
│       ├── components/          # ViewTabs, PriorityTaskSection, TaskRow, UrgentItemsCard, ProductivityScoreCard, AddTaskModal
│       ├── api/taskApi.ts        # /api/tasks 호출 함수 (백엔드 실제 응답 형태와 미검증 상태)
│       └── mock/dashboardMock.ts # 대시보드용 정적 더미 데이터
├── pages/                       # 라우트 단위 화면 — 기능 컴포넌트를 조합만 함
├── routes/router.tsx             # react-router 라우트 테이블
├── types/task.ts                 # 백엔드 DTO를 미러링하는 타입 (백엔드와 미대조 상태)
└── lib/date.ts                   # D-Day 라벨/긴급 여부 계산 유틸
```

- 경로 별칭 `@/*` → `src/*` (`vite.config.ts`, `tsconfig.app.json` 양쪽에 설정).
- 서버 상태는 `@tanstack/react-query`로, 폼 입력 등 클라이언트 전용 상태는 `useState`/`useReducer`로 다루는 것이 원칙이나, 대시보드는 아직 이 원칙을 따르지 않고 로컬 `useState` + 목업 데이터로 구현되어 있습니다.
- 전역 상태 라이브러리(Redux/Zustand 등)는 아직 없고, 실제로 필요해지기 전까지는 추가하지 않습니다.

## 디자인 시스템

`src/index.css`에 Tailwind v4 `@theme` 블록으로 Material 3 스타일 컬러/타이포/스페이싱 토큰(`--color-*`, `--text-*`, `--spacing-*`)을 정의해두었고, `@layer components`에 `glass-card`/`soft-ui-card`/`soft-shadow`/`soft-extrusion`(카드 입체감), `floating-shape`(로그인/회원가입 배경의 떠다니는 그라데이션 블롭) 같은 커스텀 클래스가 있습니다. 폰트(Inter)와 아이콘(Material Symbols Outlined)은 `index.html`의 `<link>` 태그로 Google Fonts에서 불러오며, 아이콘은 `components/ui/Icon.tsx`로 감싸 사용합니다.
