import Icon from '@/components/ui/Icon'
import { getDDayLabel, isUrgentDeadline } from '@/lib/date'
import type { PriorityTask } from '@/features/tasks/components/PriorityTaskSection'

function formatEstimatedMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const hours = minutes / 60
  return Number.isInteger(hours) ? `${hours}시간` : `${hours.toFixed(1)}시간`
}

interface TaskRowProps {
  rank: number
  task: PriorityTask
}

export default function TaskRow({ rank, task }: TaskRowProps) {
  const urgent = isUrgentDeadline(task.deadline)

  return (
    <tr className="group transition-colors hover:bg-white/40">
      <td
        className={`border-l-4 p-4 text-label-md font-bold text-primary ${
          urgent ? 'border-error' : 'border-transparent'
        }`}
      >
        {rank}순위
      </td>
      <td className="p-4">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary"
        />
      </td>
      <td className="p-4">
        <div className="flex flex-col">
          <span className="text-body-md font-bold text-primary transition-colors group-hover:text-secondary">
            {task.title}
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
          <span className="text-label-sm">{formatEstimatedMinutes(task.estimatedMinutes)}</span>
        </div>
      </td>
    </tr>
  )
}
