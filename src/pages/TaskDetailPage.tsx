import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import AddTaskModal, { type NewTaskInput } from '@/features/tasks/components/AddTaskModal'
import { taskApi } from '@/features/tasks/api/taskApi'
import { formatCompletedAt, formatMinutesLabel, getDDayLabel, isUrgentDeadline, toEndOfDayIso } from '@/lib/date'

const IMPORTANCE_LABEL: Record<number, string> = {
  5: '긴급',
  4: '높음',
  3: '보통',
  2: '낮음',
  1: '매우 낮음',
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const taskId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditModalOpen, setEditModalOpen] = useState(false)

  const taskQuery = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.get(taskId),
    enabled: Number.isFinite(taskId),
  })
  const task = taskQuery.data

  const updateMutation = useMutation({
    mutationFn: (input: NewTaskInput) =>
      taskApi.update(taskId, {
        title: input.title,
        description: input.description || undefined,
        deadline: toEndOfDayIso(input.deadline),
        importance: input.importance,
        estimatedMinutes: input.estimatedMinutes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setEditModalOpen(false)
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => taskApi.complete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => taskApi.remove(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      navigate('/')
    },
  })

  function handleDelete() {
    if (!task || !window.confirm(`"${task.title}" 항목을 삭제할까요? 되돌릴 수 없습니다.`)) return
    deleteMutation.mutate()
  }

  function handleComplete() {
    if (!task || !window.confirm(`"${task.title}" 항목을 완료 처리할까요?`)) return
    completeMutation.mutate()
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-section-gap p-container-padding">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant transition-colors hover:text-primary"
      >
        <Icon name="arrow_back" />
        대시보드로
      </button>

      {taskQuery.isLoading && <p className="text-center text-body-md text-on-surface-variant">불러오는 중...</p>}

      {taskQuery.isError && <p className="text-center text-body-md text-error">할 일을 찾을 수 없습니다.</p>}

      {task && (
        <div className="glass-card space-y-8 rounded-[24px] p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-label-sm font-bold ${
                    task.status === 'DONE'
                      ? 'bg-secondary/10 text-secondary'
                      : isUrgentDeadline(task.deadline)
                        ? 'bg-error-container/50 text-error'
                        : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {task.status === 'DONE' ? '완료됨' : getDDayLabel(task.deadline)}
                </span>
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-label-sm font-bold text-on-primary-fixed-variant">
                  {IMPORTANCE_LABEL[task.importance] ?? task.importance}
                </span>
              </div>
              <h1 className="text-headline-lg text-primary">{task.title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-secondary">
              <Icon name="bolt" filled />
              <span className="text-headline-md font-bold">{Math.round(task.score * 100)}</span>
            </div>
          </div>

          <p className="whitespace-pre-wrap text-body-md text-on-surface-variant">
            {task.description || '설명이 없습니다.'}
          </p>

          <div className="grid grid-cols-2 gap-gutter border-t border-outline-variant/20 pt-6 md:grid-cols-3">
            <div>
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">마감일</p>
              <p className="mt-1 text-label-md font-bold text-primary">{formatCompletedAt(task.deadline)}</p>
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">예상 소요 시간</p>
              <p className="mt-1 text-label-md font-bold text-primary">
                {task.estimatedMinutes ? formatMinutesLabel(task.estimatedMinutes) : '미정'}
              </p>
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">상태</p>
              <p className="mt-1 text-label-md font-bold text-primary">
                {task.status === 'DONE' ? '완료' : '진행 중'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-t border-outline-variant/20 pt-6">
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-white px-6 py-3 text-label-md font-bold text-primary transition-all hover:bg-surface-container-low active:scale-95"
            >
              <Icon name="edit" />
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 rounded-xl border border-error/30 bg-error/5 px-6 py-3 text-label-md font-bold text-error transition-all hover:bg-error/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="delete" />
              삭제
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={task.status === 'DONE' || completeMutation.isPending}
              className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="check_circle" filled />
              {task.status === 'DONE' ? '완료됨' : '완료 처리'}
            </button>
          </div>
        </div>
      )}

      {task && (
        <AddTaskModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={(input) => updateMutation.mutate(input)}
          editingTask={task}
        />
      )}
    </div>
  )
}
