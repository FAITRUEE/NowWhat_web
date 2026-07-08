import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ViewTabs from '@/features/tasks/components/ViewTabs'
import PriorityTaskSection from '@/features/tasks/components/PriorityTaskSection'
import type { PriorityTask } from '@/features/tasks/components/PriorityTaskSection'
import UrgentItemsCard from '@/features/tasks/components/UrgentItemsCard'
import type { UrgentItem } from '@/features/tasks/components/UrgentItemsCard'
import ProductivityScoreCard from '@/features/tasks/components/ProductivityScoreCard'
import AddTaskModal, { type NewTaskInput } from '@/features/tasks/components/AddTaskModal'
import TaskDetailModal from '@/features/tasks/components/TaskDetailModal'
import { taskApi } from '@/features/tasks/api/taskApi'
import { loadRerankReasons, loadTaskOrder, saveRerankReasons, saveTaskOrder } from '@/features/tasks/lib/rerankStorage'
import { historyApi } from '@/features/history/api/historyApi'
import { getDDayLabel, isCompletedOnTime, isCriticalDeadline, isUrgentDeadline, toEndOfDayIso } from '@/lib/date'
import type { Task, TaskView } from '@/types/task'

function toPriorityTask(task: Task): PriorityTask {
  return {
    id: task.id,
    title: task.title,
    deadline: task.deadline,
    score: Math.round(task.score * 100),
    estimatedMinutes: task.estimatedMinutes ?? 0,
  }
}

const MAX_URGENT_ITEMS = 4

function toUrgentItems(tasks: Task[]): UrgentItem[] {
  return tasks
    .filter((task) => isUrgentDeadline(task.deadline))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, MAX_URGENT_ITEMS)
    .map((task) => ({
      id: task.id,
      title: task.title,
      timeLabel: getDDayLabel(task.deadline),
      critical: isCriticalDeadline(task.deadline),
    }))
}

function applyOrder(tasks: PriorityTask[], orderIds: number[] | null): PriorityTask[] {
  if (!orderIds) return tasks
  const byId = new Map(tasks.map((task) => [task.id, task]))
  const ordered = orderIds.map((id) => byId.get(id)).filter((task): task is PriorityTask => task != null)
  const rest = tasks.filter((task) => !orderIds.includes(task.id))
  return [...ordered, ...rest]
}

function withReasons(tasks: PriorityTask[], reasons: Record<number, string> | null): PriorityTask[] {
  if (!reasons) return tasks
  return tasks.map((task) => (reasons[task.id] ? { ...task, reason: reasons[task.id] } : task))
}

// The most recently touched subset (an AI rerank or a manual up/down move) is put in front;
// ids from an older override that weren't part of this update keep their prior relative order
// behind it. Kept global (not per-view) since "이번주"/"오늘" are just filtered subsets of the
// same task list — a rerank done from one tab should still show up when a shared task appears
// in another tab.
function mergeOrder(existing: number[] | null, freshOrder: number[]): number[] {
  const freshSet = new Set(freshOrder)
  const remaining = (existing ?? []).filter((id) => !freshSet.has(id))
  return [...freshOrder, ...remaining]
}

function mergeReasons(
  existing: Record<number, string> | null,
  fresh: Record<number, string>,
): Record<number, string> {
  return { ...existing, ...fresh }
}

const DEFAULT_RERANK_LIMIT = 5

export default function DashboardPage() {
  const [view, setView] = useState<TaskView>('today')
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [rerankLimit, setRerankLimit] = useState(DEFAULT_RERANK_LIMIT)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const tasksQuery = useQuery({
    queryKey: ['tasks', view],
    queryFn: () => taskApi.list(view),
  })

  // Independent of the view tab, so the urgent-items card doesn't shift when the
  // user switches the priority list between today/week/all.
  const allTasksQuery = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: () => taskApi.list('all'),
  })

  const weekHistoryQuery = useQuery({
    queryKey: ['history', 'week'],
    queryFn: () => historyApi.list('week'),
  })

  // Order/reasons are kept in the react-query cache (not useState) so they survive
  // navigating away from the dashboard and back, instead of resetting on remount. Global
  // (not per-view) — see mergeOrder's comment for why. Also mirrored to per-user
  // localStorage (rerankStorage.ts) so they survive a logout -> login (or full page
  // reload) too, not just in-app navigation within the same browser session.
  const orderQuery = useQuery<number[] | null>({
    queryKey: ['taskOrder'],
    queryFn: () => null,
    initialData: () => loadTaskOrder(),
    staleTime: Infinity,
  })
  const orderIds = orderQuery.data ?? null

  const reasonsQuery = useQuery<Record<number, string> | null>({
    queryKey: ['rerankReasons'],
    queryFn: () => null,
    initialData: () => loadRerankReasons(),
    staleTime: Infinity,
  })
  const reasonsById = reasonsQuery.data ?? null

  // view/limit are passed as mutate() variables (not closed over from render state) because
  // the LLM call can take tens of seconds — if the user switches tabs while it's in flight,
  // a closure over `view` would apply the result to whatever tab they're on when it resolves
  // instead of the tab they actually reranked.
  const rerankMutation = useMutation({
    mutationFn: (variables: { view: TaskView; limit: number }) =>
      taskApi.rerank(variables.view, variables.limit),
    onSuccess: (result) => {
      const sorted = [...result].sort((a, b) => a.newRank - b.newRank)
      queryClient.setQueryData(['taskOrder'], (current: number[] | null | undefined) => {
        const next = mergeOrder(current ?? null, sorted.map((r) => r.taskId))
        saveTaskOrder(next)
        return next
      })
      queryClient.setQueryData(['rerankReasons'], (current: Record<number, string> | null | undefined) => {
        const next = mergeReasons(current ?? null, Object.fromEntries(result.map((r) => [r.taskId, r.reason])))
        saveRerankReasons(next)
        return next
      })
    },
  })

  function moveTask(id: number, direction: 'up' | 'down') {
    const currentIds = tasks.map((task) => task.id)
    const index = currentIds.indexOf(id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= currentIds.length) return
    const nextIds = [...currentIds]
    ;[nextIds[index], nextIds[swapIndex]] = [nextIds[swapIndex], nextIds[index]]
    queryClient.setQueryData(['taskOrder'], (current: number[] | null | undefined) => {
      const next = mergeOrder(current ?? null, nextIds)
      saveTaskOrder(next)
      return next
    })
  }

  const createMutation = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.removeQueries({ queryKey: ['taskOrder'] })
      queryClient.removeQueries({ queryKey: ['rerankReasons'] })
      saveTaskOrder(null)
      saveRerankReasons(null)
      setAddModalOpen(false)
    },
  })

  function handleAddTask(input: NewTaskInput) {
    createMutation.mutate({
      title: input.title,
      description: input.description || undefined,
      deadline: toEndOfDayIso(input.deadline),
      importance: input.importance,
      estimatedMinutes: input.estimatedMinutes,
    })
  }

  const baseTasks = (tasksQuery.data ?? []).map(toPriorityTask)
  const tasks = withReasons(applyOrder(baseTasks, orderIds), reasonsById)
  const urgentItems = toUrgentItems(allTasksQuery.data ?? [])

  const weekHistory = weekHistoryQuery.data ?? []
  const weekCompletedCount = weekHistory.length
  const onTimeCount = weekHistory.filter((entry) => isCompletedOnTime(entry.completedAt, entry.deadline)).length
  const productivityScore = weekCompletedCount > 0 ? Math.round((onTimeCount / weekCompletedCount) * 100) : 0
  const productivityDelta = `이번 주 ${weekCompletedCount}건 완료`
  const productivityComparison =
    weekCompletedCount === 0
      ? '완료한 항목이 아직 없어요.'
      : productivityScore >= 80
        ? '매우 우수한 흐름이에요.'
        : productivityScore >= 50
          ? '꾸준히 잘하고 있어요.'
          : '조금 더 힘내볼까요?'

  return (
    <>
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-section-gap p-container-padding">
        <PriorityTaskSection
          tasks={tasks}
          isLoading={tasksQuery.isLoading}
          error={tasksQuery.isError ? '할 일을 불러오지 못했습니다.' : null}
          onAddClick={() => setAddModalOpen(true)}
          onRerankClick={() => rerankMutation.mutate({ view, limit: rerankLimit })}
          isReranking={rerankMutation.isPending}
          rerankLimit={rerankLimit}
          onRerankLimitChange={setRerankLimit}
          onMoveTaskUp={(id) => moveTask(id, 'up')}
          onMoveTaskDown={(id) => moveTask(id, 'down')}
          onOpenTaskDetail={setSelectedTaskId}
          tabs={<ViewTabs value={view} onChange={setView} />}
        />
        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-gutter pb-12 lg:grid-cols-2">
          <UrgentItemsCard items={urgentItems} />
          <ProductivityScoreCard
            score={productivityScore}
            deltaLabel={productivityDelta}
            comparisonLabel={productivityComparison}
          />
        </section>
      </div>
      <AddTaskModal open={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddTask} />
      <TaskDetailModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </>
  )
}
