import type { PriorityTask } from '@/features/tasks/components/PriorityTaskSection'
import type { UrgentItem } from '@/features/tasks/components/UrgentItemsCard'

// TODO: replace with data from GET /api/tasks once the backend endpoint exists
export const mockPriorityTasks: PriorityTask[] = [
  {
    id: 1,
    title: '분기별 전략 기획안 작성 및 검토',
    category: 'Project X',
    deadline: '2026-07-09',
    score: 98,
    estimatedMinutes: 120,
  },
  {
    id: 2,
    title: '신규 유저 온보딩 프로세스 개선',
    category: 'Marketing',
    deadline: '2026-07-14',
    score: 85,
    estimatedMinutes: 45,
  },
  {
    id: 3,
    title: '주간 성과 데이터 대시보드 업데이트',
    category: 'Internal',
    deadline: '2026-07-07',
    score: 72,
    estimatedMinutes: 90,
  },
]

export const mockUrgentItems: UrgentItem[] = [
  { id: 1, title: '클라이언트 미팅 준비', timeLabel: '14:00 시작 (45분 전)', critical: true },
  { id: 2, title: '서버 보안 패치 승인', timeLabel: '오늘 18:00 마감' },
]

export const mockProductivity = {
  score: 85,
  deltaLabel: '+12%',
  comparisonLabel: '지난 주 대비 매우 우수함',
}
