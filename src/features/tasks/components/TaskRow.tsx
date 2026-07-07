import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { formatMinutesLabel, getDDayLabel, isUrgentDeadline } from '@/lib/date'
import type { PriorityTask } from '@/features/tasks/components/PriorityTaskSection'

interface TaskRowProps {
  rank: number
  task: PriorityTask
  onComplete?: (id: number) => void
  onMoveUp?: (id: number) => void
  onMoveDown?: (id: number) => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function TaskRow({
  rank,
  task,
  onComplete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: TaskRowProps) {
  const navigate = useNavigate()
  const [reasonOpen, setReasonOpen] = useState(false)
  const urgent = isUrgentDeadline(task.deadline)

  function handleCompleteChange(event: ChangeEvent<HTMLInputElement>) {
    if (!window.confirm(`"${task.title}" 항목을 완료 처리할까요?`)) {
      event.target.checked = false
      return
    }
    onComplete?.(task.id)
  }

  return (
    <>
      <tr
        className="group cursor-pointer transition-colors hover:bg-white/40"
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        <td
          className={`border-l-4 p-4 text-label-md font-bold text-primary ${
            urgent ? 'border-error' : 'border-transparent'
          }`}
        >
          <div className="flex items-center gap-1">
            <span>{rank}순위</span>
            <div className="flex flex-col" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                onClick={() => onMoveUp?.(task.id)}
                disabled={!canMoveUp}
                className="leading-none text-outline/60 transition-colors hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="keyboard_arrow_up" className="text-base" />
              </button>
              <button
                type="button"
                onClick={() => onMoveDown?.(task.id)}
                disabled={!canMoveDown}
                className="leading-none text-outline/60 transition-colors hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="keyboard_arrow_down" className="text-base" />
              </button>
            </div>
          </div>
        </td>
        <td className="p-4" onClick={(event) => event.stopPropagation()}>
          <input
            type="checkbox"
            onChange={handleCompleteChange}
            className="h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary"
          />
        </td>
        <td className="p-4">
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-body-md font-bold text-primary transition-colors group-hover:text-secondary">
              {task.title}
              {task.reason && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setReasonOpen((open) => !open)
                  }}
                  aria-label="AI 추천 이유 보기"
                  className="leading-none"
                >
                  <Icon
                    name="auto_awesome"
                    className={`text-sm ${reasonOpen ? 'text-secondary' : 'text-secondary/50'}`}
                  />
                </button>
              )}
            </span>
            {task.category && (
              <span className="text-label-sm text-on-surface-variant opacity-70">{task.category}</span>
            )}
          </div>
        </td>
        <td className="p-4">
          <span
            className={`rounded-full px-3 py-1 text-label-sm font-bold ${
              urgent
                ? 'bg-error-container/50 text-error'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {getDDayLabel(task.deadline)}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-secondary">
            <Icon name="bolt" filled className="text-sm" />
            <span className="text-label-md font-bold">{task.score}</span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="schedule" className="text-sm" />
            <span className="text-label-sm">{formatMinutesLabel(task.estimatedMinutes)}</span>
          </div>
        </td>
      </tr>
      {reasonOpen && task.reason && (
        <tr className="bg-secondary/5">
          <td colSpan={6} className="px-4 pb-4">
            <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 text-label-sm italic text-secondary">
              <Icon name="auto_awesome" className="mt-0.5 text-sm" />
              {task.reason}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
