import { apiClient } from '@/api/client'

export interface TaskHistoryEntry {
  taskId: number
  title: string
  completedAt: string
  actualMinutes: number
  estimatedMinutes: number | null
  deadline: string
}

export type HistoryApiPeriod = 'week' | 'month'

export const historyApi = {
  list: (period: HistoryApiPeriod) =>
    apiClient.get<TaskHistoryEntry[]>('/tasks/history', { params: { period } }).then((res) => res.data),
}
