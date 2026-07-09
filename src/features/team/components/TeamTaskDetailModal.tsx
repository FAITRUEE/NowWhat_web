import { useEffect, useState, type FormEvent } from 'react'
import Icon from '@/components/ui/Icon'
import DatePicker from '@/components/ui/DatePicker'
import { formatMinutesLabel, getDDayLabel } from '@/lib/date'
import type { TaskInput } from '@/types/task'
import type { TeamMember, TeamTask } from '@/features/team/api/teamApi'

const IMPORTANCE_OPTIONS: { value: 1 | 3 | 5; label: string }[] = [
  { value: 5, label: '긴급' },
  { value: 3, label: '보통' },
  { value: 1, label: '낮음' },
]

const MIN_ESTIMATED_MINUTES = 5
const MAX_ESTIMATED_MINUTES = 240
const ESTIMATED_MINUTES_STEP = 5

function nearestImportanceOption(value: number): 1 | 3 | 5 {
  return IMPORTANCE_OPTIONS.map((option) => option.value).reduce((best, candidate) =>
    Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best,
  )
}

interface TeamTaskDetailModalProps {
  task: TeamTask | null
  currentUserEmail: string | null
  members: TeamMember[]
  onClose: () => void
  onUpdate: (taskId: number, input: TaskInput) => void
  onDelete: (taskId: number) => void
  onReassign: (taskId: number, assigneeUserId: number) => void
  isSaving?: boolean
  isDeleting?: boolean
  isReassigning?: boolean
}

export default function TeamTaskDetailModal({
  task,
  currentUserEmail,
  members,
  onClose,
  onUpdate,
  onDelete,
  onReassign,
  isSaving,
  isDeleting,
  isReassigning,
}: TeamTaskDetailModalProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [importance, setImportance] = useState<1 | 3 | 5>(3)
  const [estimatedMinutes, setEstimatedMinutes] = useState(30)

  useEffect(() => {
    setEditing(false)
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? '')
      setDeadline(task.deadline.slice(0, 10))
      setImportance(nearestImportanceOption(task.importance))
      setEstimatedMinutes(Math.min(MAX_ESTIMATED_MINUTES, Math.max(MIN_ESTIMATED_MINUTES, task.estimatedMinutes ?? 30)))
    }
  }, [task])

  if (!task) return null

  const isOwner = task.assigneeEmail === currentUserEmail

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!task || title.trim() === '' || deadline === '') return
    onUpdate(task.id, {
      title,
      description: description || undefined,
      deadline: `${deadline}T23:59:59`,
      importance,
      estimatedMinutes,
    })
  }

  function handleDelete() {
    if (!task) return
    if (!window.confirm(`"${task.title}" 업무를 삭제할까요?`)) return
    onDelete(task.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-2xl">
      <div className="soft-shadow flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-surface-variant/30 p-8">
          <div>
            <h3 className="text-headline-md text-primary">{editing ? '업무 수정' : '업무 상세'}</h3>
            <div className="mt-1 flex items-center gap-2">
              <label className="text-label-md text-on-surface-variant">담당자</label>
              <select
                value={task.assigneeUserId}
                onChange={(event) => onReassign(task.id, Number(event.target.value))}
                disabled={isReassigning}
                className="rounded-lg border border-outline-variant/30 bg-white px-2 py-1 text-label-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant/40"
          >
            <Icon name="close" />
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
            <div className="space-y-8 overflow-y-auto p-8">
              <div className="space-y-2">
                <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl bg-surface-container-low px-4 py-4 text-body-lg font-medium italic shadow-inner placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">마감 날짜</label>
                  <DatePicker value={deadline} onChange={setDeadline} />
                </div>
                <div className="space-y-2">
                  <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">중요도</label>
                  <div className="flex gap-2">
                    {IMPORTANCE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setImportance(option.value)}
                        className={`flex-1 rounded-xl py-3 text-label-md transition-all ${
                          importance === option.value
                            ? 'bg-secondary-container font-bold text-on-secondary-container shadow-sm'
                            : 'border border-outline-variant/30 hover:bg-surface-variant'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="soft-extrusion space-y-4 rounded-2xl bg-surface-container-low p-6">
                <div className="flex items-center justify-between">
                  <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    예상 소요 시간
                  </label>
                  <span className="rounded-full bg-primary px-3 py-1 text-label-sm text-white">
                    {formatMinutesLabel(estimatedMinutes)}
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_ESTIMATED_MINUTES}
                  max={MAX_ESTIMATED_MINUTES}
                  step={ESTIMATED_MINUTES_STEP}
                  value={estimatedMinutes}
                  onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant/30 accent-secondary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">메모</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="h-24 w-full resize-none rounded-xl border border-outline-variant/30 bg-white p-4 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>

            <div className="flex gap-4 border-t border-surface-variant/30 bg-surface/30 p-8">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="soft-extrusion flex-1 rounded-xl border border-outline-variant/50 bg-white py-4 font-bold text-primary transition-all hover:bg-surface active:scale-[0.98]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaving || title.trim() === ''}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="save" />
                {isSaving ? '저장하는 중...' : '저장하기'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-6 overflow-y-auto p-8">
              <p className="text-headline-md text-primary">{task.title}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-bold text-on-surface-variant">
                  {getDDayLabel(task.deadline)}
                </span>
                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-bold text-on-surface-variant">
                  중요도 {task.importance}
                </span>
                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-bold text-on-surface-variant">
                  {formatMinutesLabel(task.estimatedMinutes ?? 0)}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-label-sm font-bold text-secondary">
                  <Icon name="auto_awesome" className="text-sm" />
                  {Math.round(task.score * 100)}점
                </span>
              </div>
              {task.description && (
                <p className="rounded-xl bg-surface-container-low/50 p-4 text-body-md text-on-surface-variant">
                  {task.description}
                </p>
              )}
              {!isOwner && (
                <p className="text-label-sm text-on-surface-variant opacity-70">
                  담당자만 수정·삭제할 수 있어요. 위의 담당자 선택으로 바꿀 수 있어요.
                </p>
              )}
            </div>

            <div className="flex gap-4 border-t border-surface-variant/30 bg-surface/30 p-8">
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isOwner || isDeleting}
                className="flex items-center gap-2 rounded-xl border border-error/30 bg-error-container/30 px-6 py-4 font-bold text-error transition-all hover:bg-error-container/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="delete" />
                {isDeleting ? '삭제하는 중...' : '삭제'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={!isOwner}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="edit" />
                수정
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
