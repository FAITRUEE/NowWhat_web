export interface PreviewTask {
  id: number
  title: string
  tag: string
  dDay: string
  urgency: number
  importance: number
  timeReq: number
  accent: 'error' | 'primary' | 'secondary'
}

// Illustrative-only mock tasks for the live re-rank preview; not backed by real task data.
export const mockPreviewTasks: PreviewTask[] = [
  { id: 1, title: '분기 전략 확정', tag: '전략', dDay: 'D-2', urgency: 80, importance: 95, timeReq: 90, accent: 'error' },
  { id: 2, title: '고객 피드백 답변', tag: '고객', dDay: 'D-1', urgency: 95, importance: 70, timeReq: 20, accent: 'error' },
  {
    id: 3,
    title: '새로운 디자인 트렌드 조사',
    tag: '개인',
    dDay: 'D-7',
    urgency: 20,
    importance: 40,
    timeReq: 60,
    accent: 'secondary',
  },
  {
    id: 4,
    title: '주간 파이프라인 검토',
    tag: '운영',
    dDay: 'D-3',
    urgency: 50,
    importance: 60,
    timeReq: 45,
    accent: 'primary',
  },
  { id: 5, title: '문서 업데이트', tag: '관리', dDay: 'D-5', urgency: 40, importance: 30, timeReq: 30, accent: 'secondary' },
]
