export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskView = 'today' | 'week' | 'all'

export interface Task {
  id: number
  title: string
  description: string | null
  deadline: string
  importance: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number | null
  status: TaskStatus
  score: number
  createdAt: string
  updatedAt: string
  teamId: number | null
}

export interface TaskInput {
  title: string
  description?: string
  deadline: string
  importance: 1 | 2 | 3 | 4 | 5
  estimatedMinutes?: number
}

export interface RerankedTask {
  taskId: number
  newRank: number
  reason: string
}
