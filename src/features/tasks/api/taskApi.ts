import { apiClient } from '@/api/client'
import type { RerankedTask, Task, TaskInput, TaskStatus, TaskView } from '@/types/task'

export const taskApi = {
  list: (view: TaskView) =>
    apiClient.get<Task[]>('/tasks', { params: { view } }).then((res) => res.data),

  calendar: (from: string, to: string) =>
    apiClient.get<Task[]>('/tasks/calendar', { params: { from, to } }).then((res) => res.data),

  get: (id: number) => apiClient.get<Task>(`/tasks/${id}`).then((res) => res.data),

  create: (input: TaskInput) =>
    apiClient.post<Task>('/tasks', input).then((res) => res.data),

  update: (id: number, input: TaskInput) =>
    apiClient.put<Task>(`/tasks/${id}`, input).then((res) => res.data),

  remove: (id: number) => apiClient.delete(`/tasks/${id}`),

  complete: (id: number, actualMinutes?: number) =>
    apiClient
      .patch<Task>(`/tasks/${id}/complete`, { actualMinutes })
      .then((res) => res.data),

  rerank: (view: TaskView, limit: number) =>
    apiClient
      .post<RerankedTask[]>('/tasks/rerank', null, { params: { view, limit } })
      .then((res) => res.data),

  updateStatus: (id: number, status: TaskStatus) =>
    apiClient.patch<Task>(`/tasks/${id}/status`, { status }).then((res) => res.data),

  reassignToMe: (id: number) => apiClient.patch<Task>(`/tasks/${id}/reassign`).then((res) => res.data),

  reassign: (id: number, assigneeUserId: number) =>
    apiClient.patch<Task>(`/tasks/${id}/reassign`, { assigneeUserId }).then((res) => res.data),
}
