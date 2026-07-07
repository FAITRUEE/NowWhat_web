import Icon from '@/components/ui/Icon'

export interface TodayTask {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  timeLabel: string
  done?: boolean
}

const PRIORITY_BADGE: Record<TodayTask['priority'], string> = {
  high: 'bg-error/10 text-error',
  medium: 'bg-secondary/10 text-secondary',
  low: 'bg-surface-container text-on-surface-variant',
}

const PRIORITY_LABEL: Record<TodayTask['priority'], string> = {
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
}

interface TodayTaskListProps {
  title: string
  dateLabel: string
  tasks: TodayTask[]
  onAddClick: () => void
}

export default function TodayTaskList({ title, dateLabel, tasks, onAddClick }: TodayTaskListProps) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="mb-2 text-headline-md text-primary">{title}</h3>
        <p className="text-label-sm text-on-surface-variant">{dateLabel}</p>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="rounded-2xl bg-surface-container-low/50 p-6 text-center text-label-md text-on-surface-variant">
            이 날짜에는 할 일이 없어요.
          </p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`soft-ui-card group cursor-pointer rounded-2xl p-4 transition-all hover:-translate-y-1 ${
              task.done ? 'opacity-70' : ''
            }`}
          >
            {task.done ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-label-sm font-bold text-secondary">
                <Icon name="check_circle" filled className="text-sm" />
                완료됨
              </span>
            ) : (
              <span className={`rounded-full px-2 py-0.5 text-label-sm font-bold ${PRIORITY_BADGE[task.priority]}`}>
                {PRIORITY_LABEL[task.priority]}
              </span>
            )}
            <h4 className="mt-2 mb-1 text-label-md font-bold text-primary">{task.title}</h4>
            <p className="line-clamp-2 text-label-sm text-on-surface-variant">{task.description}</p>
            <div className="mt-4 flex items-center gap-2 text-on-surface-variant">
              <Icon name="schedule" className="text-sm" />
              <span className="text-label-sm font-medium">{task.timeLabel}</span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddClick}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-variant/50 p-4 text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          <Icon name="add_circle" className="text-2xl" />
          <span className="text-label-sm">추가 작업 등록</span>
        </button>
      </div>
    </div>
  )
}
