import { useEffect, useState, type FormEvent } from 'react'
import Icon from '@/components/ui/Icon'
import DatePicker from '@/components/ui/DatePicker'
import { formatMinutesLabel } from '@/lib/date'
import type { Task } from '@/types/task'

export interface NewTaskInput {
  title: string
  description: string
  deadline: string
  importance: 1 | 3 | 5
  estimatedMinutes: number
}

const IMPORTANCE_OPTIONS: { value: 1 | 3 | 5; label: string }[] = [
  { value: 5, label: '긴급' },
  { value: 3, label: '보통' },
  { value: 1, label: '낮음' },
]

const MIN_ESTIMATED_MINUTES = 5
const MAX_ESTIMATED_MINUTES = 240
const ESTIMATED_MINUTES_STEP = 5
const DEFAULT_ESTIMATED_MINUTES = 30

function nearestImportanceOption(value: number): 1 | 3 | 5 {
  return IMPORTANCE_OPTIONS.map((option) => option.value).reduce((best, candidate) =>
    Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best,
  )
}

function clampEstimatedMinutes(value: number): number {
  const stepped = Math.round(value / ESTIMATED_MINUTES_STEP) * ESTIMATED_MINUTES_STEP
  return Math.min(MAX_ESTIMATED_MINUTES, Math.max(MIN_ESTIMATED_MINUTES, stepped))
}

interface AddTaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: NewTaskInput) => void
  defaultDeadline?: string
  editingTask?: Task | null
}

export default function AddTaskModal({ open, onClose, onSubmit, defaultDeadline, editingTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [importance, setImportance] = useState<1 | 3 | 5>(3)
  const [estimatedMinutes, setEstimatedMinutes] = useState(DEFAULT_ESTIMATED_MINUTES)

  useEffect(() => {
    if (!open) return
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description ?? '')
      setDeadline(editingTask.deadline.slice(0, 10))
      setImportance(nearestImportanceOption(editingTask.importance))
      setEstimatedMinutes(clampEstimatedMinutes(editingTask.estimatedMinutes ?? DEFAULT_ESTIMATED_MINUTES))
    } else {
      setTitle('')
      setDescription('')
      setDeadline(defaultDeadline ?? '')
      setImportance(3)
      setEstimatedMinutes(DEFAULT_ESTIMATED_MINUTES)
    }
  }, [open, editingTask, defaultDeadline])

  if (!open) return null

  const isEditing = editingTask != null
  const canSubmit = title.trim() !== '' && deadline !== ''

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit({ title, description, deadline, importance, estimatedMinutes })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-2xl">
      <form
        onSubmit={handleSubmit}
        className="soft-shadow flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-surface-variant/30 p-8">
          <div>
            <h3 className="text-headline-md text-primary">{isEditing ? '할 일 수정' : '할 일 추가'}</h3>
            <p className="text-label-md text-on-surface-variant">
              {isEditing ? '내용을 수정하고 저장하세요.' : '어떤 목표를 향해 나아가시나요?'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant/40"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto p-8">
          <div className="space-y-2">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">할 일 제목</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 디자인 시스템 문서화 완료"
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
            <div className="relative py-4">
              <input
                type="range"
                min={MIN_ESTIMATED_MINUTES}
                max={MAX_ESTIMATED_MINUTES}
                step={ESTIMATED_MINUTES_STEP}
                value={estimatedMinutes}
                onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant/30 accent-secondary"
              />
              <div className="mt-2 flex justify-between px-1 text-label-sm text-on-surface-variant opacity-50">
                <span>5분</span>
                <span>4시간</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">메모</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="추가 상세 내용을 입력하세요..."
              className="h-24 w-full resize-none rounded-xl border border-outline-variant/30 bg-white p-4 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>
        </div>

        <div className="flex gap-4 border-t border-surface-variant/30 bg-surface/30 p-8">
          <button
            type="button"
            onClick={onClose}
            className="soft-extrusion flex-1 rounded-xl border border-outline-variant/50 bg-white py-4 font-bold text-primary transition-all hover:bg-surface active:scale-[0.98]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name={isEditing ? 'save' : 'add_task'} />
            {isEditing ? '수정 저장하기' : '할 일 생성하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
