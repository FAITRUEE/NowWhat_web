import type { TaskStatus } from '@/types/task'
import type { TeamTask } from '@/features/team/api/teamApi'

export const BOARD_COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export function groupByStatus(tasks: TeamTask[]): Record<TaskStatus, TeamTask[]> {
  const grouped: Record<TaskStatus, TeamTask[]> = { TODO: [], IN_PROGRESS: [], DONE: [] }
  for (const task of tasks) {
    grouped[task.status].push(task)
  }
  return grouped
}

export function sortByPriority(tasks: TeamTask[]): TeamTask[] {
  return tasks.filter((task) => task.status !== 'DONE').sort((a, b) => b.score - a.score)
}

// Lets a manual up/down reorder in the priority view stick even though `tasks` is
// re-sorted by score on every fetch: known ids from `orderIds` come first in that order,
// then any task not covered by it (new, or never reordered) keeps its score-sorted place.
export function applyManualOrder(tasks: TeamTask[], orderIds: number[] | null): TeamTask[] {
  if (!orderIds) return tasks
  const byId = new Map(tasks.map((task) => [task.id, task]))
  const ordered = orderIds.map((id) => byId.get(id)).filter((task): task is TeamTask => task != null)
  const rest = tasks.filter((task) => !orderIds.includes(task.id))
  return [...ordered, ...rest]
}
