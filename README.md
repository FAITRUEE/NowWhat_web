# NowWhat — 할 일 우선순위 추천 서비스 (Frontend)

사용자의 할 일 목록을 마감일·중요도·소요시간 기준으로 분석해 오늘 무엇부터 해야 하는지 자동으로 추천해주는 개인 생산성 서비스의 프론트엔드입니다. [백엔드(NowWhat_was)](../NowWhat_was)와 함께 동작하도록 설계되었습니다.

## 현재 상태

로그인부터 대시보드/이력/캘린더/가중치 설정까지 전 화면이 **실제 백엔드 API에 연동**되어 있습니다 (`@tanstack/react-query` 기반).

| 화면 | 상태 |
|---|---|
| 로그인 (SC-01) / 회원가입 (SC-02) | `POST /api/auth/login`, `/api/auth/signup` 실제 호출, JWT를 `localStorage`에 저장 |
| 메인 대시보드 (SC-03) | 우선순위 테이블(`GET /api/tasks`, 완료·재정렬 포함), 긴급 항목/정시 완료율 카드는 이미 불러온 태스크·이력 데이터에서 클라이언트 측으로 파생. 리스트 항목 클릭 시 SC-05 상세 화면으로 이동 |
| 할 일 상세 (SC-05) | `/tasks/:id`, `GET /api/tasks/{id}`. 수정(SC-04 모달 재사용) / 삭제(확인 다이얼로그 → `DELETE`) / 완료 처리 버튼 |
| 할 일 등록/수정 모달 (SC-04) | `AddTaskModal`이 생성(대시보드 "할 일 추가", 캘린더)과 수정(상세 화면 "수정" 버튼) 양쪽에 재사용됨 — `editingTask` prop 유무로 모드 전환 |
| LLM 재정렬 (SC-08, 확장) | 대시보드의 "AI 재정렬" 버튼 → `POST /api/tasks/rerank`, 순서/추천 이유를 표시 |
| 완료 이력 (SC-06) | `GET /api/tasks/history?period=week\|month` |
| 가중치 설정 (SC-07) | `GET`/`PUT /api/users/weights`, "초기화" 버튼으로 기본값(50/30/20) 복귀(로컬 상태만 되돌림 — 저장하려면 "가중치 적용"을 다시 눌러야 함). 우측 "실시간 미리보기"는 스펙(SC-07)에 명시된 대로 예시 데이터이며 실제 태스크가 아님 |
| 캘린더 (기획 문서에 없는 신규 화면) | `GET /api/tasks/calendar?from=&to=` (완료 항목 포함), 날짜 클릭 시 해당 날짜 상세를 우측에 표시, 모달로 실제 태스크 생성 |

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 8 |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`), Material 3 스타일 커스텀 디자인 토큰 |
| 라우팅 | react-router-dom v7 |
| 서버 상태 | @tanstack/react-query |
| HTTP 클라이언트 | axios |
| 아이콘 / 폰트 | Material Symbols Outlined, Inter (Google Fonts) |
| 린트 | oxlint |

## 시작하기

```bash
npm install
npm run dev        # http://localhost:5173, /api 요청은 http://localhost:8080 으로 프록시 (vite.config.ts)
```

백엔드(`NowWhat_was`)를 `./gradlew bootRun`으로 함께 띄워야 로그인을 포함한 모든 화면이 정상 동작합니다. 백엔드가 첫 실행 시 시드하는 데모 계정(`demo@nowwhat.com` / `demo1234`)으로 바로 로그인해볼 수 있습니다.

```bash
npm run build       # tsc -b && vite build
npm run lint         # oxlint
npm run test          # vitest run
npm run preview      # 프로덕션 빌드 미리보기
```

Vitest + React Testing Library로 테스트합니다 (`vite.config.ts`의 `test` 블록, `src/test/setup.ts`). `*.test.ts`/`*.test.tsx` 파일은 대상 파일 옆에 둡니다 (예: `src/lib/date.test.ts`).

## 프로젝트 구조

기능(feature) 기반 구조를 사용합니다.

```
src/
├── api/client.ts              # 공용 axios 인스턴스 — localStorage의 JWT 부착, 401 시 /login 리다이렉트
├── components/
│   ├── ui/                     # 범용 프레젠테이션 컴포넌트 (API 호출/비즈니스 로직 없음) — Icon, TextField, DatePicker
│   └── layout/                 # 페이지 뼈대 — MainLayout(Sidebar+Outlet), AuthLayout(로그인/회원가입 공용 배경), Sidebar, PageHeader
├── features/
│   ├── auth/{components,api}    # LoginForm, SignupForm, authApi.ts
│   ├── tasks/
│   │   ├── components/           # ViewTabs, PriorityTaskSection, TaskRow, UrgentItemsCard, ProductivityScoreCard, AddTaskModal
│   │   └── api/taskApi.ts         # /api/tasks 호출 함수 (list/calendar/create/update/remove/complete/rerank)
│   ├── history/{components,api}  # HistoryPeriodTabs, HistoryStatCard, CompletedTaskTable, InsightBanner, historyApi.ts
│   ├── weights/{components,api,lib,mock} # PriorityWeightsPanel, LivePreviewPanel(예시 데이터), weightApi.ts
│   └── calendar/{components,lib} # CalendarToolbar, CalendarGrid, TodayTaskList, monthGrid.ts(달력 그리드 계산)
├── pages/                       # 라우트 단위 화면 — 기능 컴포넌트를 조합만 함 (TaskDetailPage 포함)
├── routes/router.tsx             # react-router 라우트 테이블
├── types/task.ts                 # 백엔드 DTO를 미러링하는 타입
├── lib/date.ts                   # D-Day 라벨/긴급·초과 여부/시간 포맷 유틸
└── test/setup.ts                 # Vitest + jest-dom 전역 설정
```

- 경로 별칭 `@/*` → `src/*` (`vite.config.ts`, `tsconfig.app.json` 양쪽에 설정).
- 서버 상태는 `@tanstack/react-query`, 폼 입력 등 클라이언트 전용 상태는 `useState`/`useReducer`로 다룹니다.
- 전역 상태 라이브러리(Redux/Zustand 등)는 아직 없고, 실제로 필요해지기 전까지는 추가하지 않습니다.

## 디자인 시스템

`src/index.css`에 Tailwind v4 `@theme` 블록으로 Material 3 스타일 컬러/타이포/스페이싱 토큰(`--color-*`, `--text-*`, `--spacing-*`)을 정의해두었고, `@layer components`에 `glass-card`/`soft-ui-card`/`soft-shadow`/`soft-extrusion`(카드 입체감), `floating-shape`(로그인/회원가입 배경의 떠다니는 그라데이션 블롭) 같은 커스텀 클래스가 있습니다. 폰트(Inter)와 아이콘(Material Symbols Outlined)은 `index.html`의 `<link>` 태그로 Google Fonts에서 불러오며, 아이콘은 `components/ui/Icon.tsx`로 감싸 사용합니다.
