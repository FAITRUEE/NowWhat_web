import Icon from '@/components/ui/Icon'
import { formatCompletedAt, formatMinutesLabel, isCompletedOnTime } from '@/lib/date'
import type { CompletedTask } from '@/features/history/components/CompletedTaskTable'

interface CompletedTaskRowProps {
  task: CompletedTask
}

export default function CompletedTaskRow({ task }: CompletedTaskRowProps) {
  const onTime = isCompletedOnTime(task.completedAt, task.deadline)

  return (
    <tr className="group transition-colors hover:bg-surface-container-low/50">
      <td className="p-6">
        <p className="text-body-md font-bold text-primary transition-colors group-hover:text-secondary">
          {task.title}
        </p>
        <p className="text-label-sm text-on-surface-variant opacity-70">{formatCompletedAt(task.completedAt)}</p>
      </td>
      <td className="p-6 text-body-md text-on-surface-variant">{formatMinutesLabel(task.actualMinutes)}</td>
      <td className="p-6">
        {onTime ? (
          <div className="flex items-center gap-2 text-secondary">
            <Icon name="check_circle" filled className="text-base" />
            <span className="text-label-md font-bold">완료됨</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-error/10 px-3 py-1 text-error w-fit">
            <Icon name="error" filled className="text-base" />
            <span className="text-label-md font-bold">기한 초과 완료</span>
          </div>
        )}
      </td>
    </tr>
  )
}
