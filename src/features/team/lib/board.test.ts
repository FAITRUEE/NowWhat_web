import { describe, expect, it } from 'vitest'
import { applyManualOrder, groupByStatus, sortByPriority } from '@/features/team/lib/board'
import type { TeamTask } from '@/features/team/api/teamApi'

function makeTask(overrides: Partial<TeamTask>): TeamTask {
  return {
    id: 1,
    title: '테스트 업무',
    description: null,
    deadline: '2026-08-01T00:00:00',
    importance: 3,
    estimatedMinutes: 30,
    status: 'TODO',
    score: 0.5,
    teamId: 1,
    assigneeUserId: 1,
    assigneeEmail: 'a@example.com',
    ...overrides,
  }
}

describe('groupByStatus', () => {
  it('buckets tasks into TODO/IN_PROGRESS/DONE columns', () => {
    const tasks = [
      makeTask({ id: 1, status: 'TODO' }),
      makeTask({ id: 2, status: 'IN_PROGRESS' }),
      makeTask({ id: 3, status: 'DONE' }),
      makeTask({ id: 4, status: 'TODO' }),
    ]

    const grouped = groupByStatus(tasks)

    expect(grouped.TODO.map((t) => t.id)).toEqual([1, 4])
    expect(grouped.IN_PROGRESS.map((t) => t.id)).toEqual([2])
    expect(grouped.DONE.map((t) => t.id)).toEqual([3])
  })

  it('returns empty arrays for a status with no tasks', () => {
    const grouped = groupByStatus([makeTask({ id: 1, status: 'TODO' })])

    expect(grouped.IN_PROGRESS).toEqual([])
    expect(grouped.DONE).toEqual([])
  })
})

describe('sortByPriority', () => {
  it('sorts by score descending', () => {
    const tasks = [
      makeTask({ id: 1, score: 0.2 }),
      makeTask({ id: 2, score: 0.9 }),
      makeTask({ id: 3, score: 0.5 }),
    ]

    expect(sortByPriority(tasks).map((t) => t.id)).toEqual([2, 3, 1])
  })

  it('excludes DONE tasks from the priority ranking', () => {
    const tasks = [
      makeTask({ id: 1, status: 'DONE', score: 0.99 }),
      makeTask({ id: 2, status: 'TODO', score: 0.1 }),
    ]

    expect(sortByPriority(tasks).map((t) => t.id)).toEqual([2])
  })
})

describe('applyManualOrder', () => {
  it('returns the input unchanged when there is no override', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })]

    expect(applyManualOrder(tasks, null).map((t) => t.id)).toEqual([1, 2])
  })

  it('reorders tasks to match the given id order', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 }), makeTask({ id: 3 })]

    expect(applyManualOrder(tasks, [3, 1, 2]).map((t) => t.id)).toEqual([3, 1, 2])
  })

  it('appends tasks missing from the override after the ordered ones', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 }), makeTask({ id: 3 })]

    expect(applyManualOrder(tasks, [2]).map((t) => t.id)).toEqual([2, 1, 3])
  })

  it('drops ids from the override that no longer exist in the tasks', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })]

    expect(applyManualOrder(tasks, [99, 2, 1]).map((t) => t.id)).toEqual([2, 1])
  })
})
