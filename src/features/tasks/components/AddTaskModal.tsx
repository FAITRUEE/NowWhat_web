import { useState, type FormEvent } from 'react'
import Icon from '@/components/ui/Icon'

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

const EFFORT_OPTIONS: { value: number; label: string; timeLabel: string }[] = [
  { value: 30, label: 'Low', timeLabel: '30분' },
  { value: 60, label: 'Mid', timeLabel: '1시간' },
  { value: 120, label: 'High', timeLabel: '2시간' },
]

interface AddTaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: NewTaskInput) => void
}

export default function AddTaskModal({ open, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [importance, setImportance] = useState<1 | 3 | 5>(3)
  const [effortIndex, setEffortIndex] = useState(2)

  if (!open) return null

  const canSubmit = title.trim() !== '' && deadline !== ''
  const effort = EFFORT_OPTIONS[effortIndex]

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit({ title, description, deadline, importance, estimatedMinutes: effort.value })
    setTitle('')
    setDescription('')
    setDeadline('')
    setImportance(3)
    setEffortIndex(2)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-2xl">
      <form
        onSubmit={handleSubmit}
        className="soft-shadow flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-surface-variant/30 p-8">
          <div>
            <h3 className="text-headline-md text-primary">할 일 추가</h3>
            <p className="text-label-md text-on-surface-variant">어떤 목표를 향해 나아가시나요?</p>
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
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/30 bg-white py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
                <Icon
                  name="calendar_today"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
              </div>
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
              <span className="rounded-full bg-primary px-3 py-1 text-label-sm text-white">{effort.label}</span>
            </div>
            <div className="relative py-4">
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={effortIndex}
                onChange={(event) => setEffortIndex(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant/30 accent-secondary"
              />
              <div className="mt-2 flex justify-between px-1">
                {EFFORT_OPTIONS.map((option) => (
                  <span key={option.value} className="text-label-sm text-on-surface-variant opacity-50">
                    {option.timeLabel}
                  </span>
                ))}
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
            <Icon name="add_task" />
            할 일 생성하기
          </button>
        </div>
      </form>
    </div>
  )
}
