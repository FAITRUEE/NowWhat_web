import { apiClient } from '@/api/client'
import type { TaskStatus } from '@/types/task'

export interface TeamMember {
  userId: number
  email: string
}

export interface Team {
  id: number
  name: string
  ownerId: number
  members: TeamMember[]
  createdAt: string
}

export interface TeamTask {
  id: number
  title: string
  description: string | null
  deadline: string
  importance: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number | null
  status: TaskStatus
  score: number
  teamId: number
  assigneeUserId: number
  assigneeEmail: string
}

export interface TeamTaskCreateInput {
  title: string
  description?: string
  deadline: string
  importance: 1 | 2 | 3 | 4 | 5
  estimatedMinutes?: number
  assigneeUserId: number
}

export interface TeamBundle {
  id: number
  tasks: TeamTask[]
}

export const teamApi = {
  list: () => apiClient.get<Team[]>('/teams').then((res) => res.data),

  create: (name: string) => apiClient.post<Team>('/teams', { name }).then((res) => res.data),

  detail: (id: number) => apiClient.get<Team>(`/teams/${id}`).then((res) => res.data),

  addMember: (id: number, email: string) =>
    apiClient.post<Team>(`/teams/${id}/members`, { email }).then((res) => res.data),

  organize: (id: number) => apiClient.post<TeamBundle[]>(`/teams/${id}/organize`).then((res) => res.data),

  bundles: (id: number) => apiClient.get<TeamBundle[]>(`/teams/${id}/bundles`).then((res) => res.data),

  board: (id: number) => apiClient.get<TeamTask[]>(`/teams/${id}/board`).then((res) => res.data),

  createTask: (id: number, input: TeamTaskCreateInput) =>
    apiClient.post<TeamTask>(`/teams/${id}/tasks`, input).then((res) => res.data),
}
