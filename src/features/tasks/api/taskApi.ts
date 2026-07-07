import { apiClient } from '@/api/client'
import type { Task, TaskInput, TaskView } from '@/types/task'

export const taskApi = {
  list: (view: TaskView) =>
    apiClient.get<Task[]>('/tasks', { params: { view } }).then((res) => res.data),

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
}
