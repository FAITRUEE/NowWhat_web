import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import Icon from '@/components/ui/Icon'
import { formatMinutesLabel, getDDayLabel, isUrgentDeadline } from '@/lib/date'
import type { TaskStatus } from '@/types/task'
import type { TeamTask } from '@/features/team/api/teamApi'
import { BOARD_COLUMNS, groupByStatus } from '@/features/team/lib/board'

const COLUMN_LABEL: Record<TaskStatus, string> = {
  TODO: '할 일',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
}

const COLUMN_DOT: Record<TaskStatus, string> = {
  TODO: 'bg-outline',
  IN_PROGRESS: 'bg-secondary',
  DONE: 'bg-emerald-500',
}

const COLUMN_TINT: Record<TaskStatus, string> = {
  TODO: 'bg-surface-container-low/60',
  IN_PROGRESS: 'bg-secondary/5',
  DONE: 'bg-emerald-500/5',
}

interface KanbanBoardProps {
  tasks: TeamTask[]
  onStatusChange: (taskId: number, status: TaskStatus) => void
  onOpenDetail: (taskId: number) => void
}

function KanbanCard({ task, onOpenDetail }: { task: TeamTask; onOpenDetail: (taskId: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: isDragging ? 10 : undefined }
    : undefined
  const urgent = isUrgentDeadline(task.deadline)
  const done = task.status === 'DONE'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onOpenDetail(task.id)}
      className={`flex cursor-grab flex-col gap-3 rounded-xl border border-outline-variant/20 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-outline-variant/40 hover:shadow-md active:cursor-grabbing ${
        isDragging ? 'opacity-70' : ''
      } ${done ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        {done ? (
          <span className="flex items-center gap-1 text-label-sm font-bold text-emerald-600">
            <Icon name="check_circle" filled className="text-sm" />
            완료
          </span>
        ) : (
          <span
            className={`rounded px-2 py-0.5 text-label-sm font-bold ${
              urgent ? 'bg-error-container/50 text-error' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {getDDayLabel(task.deadline)}
          </span>
        )}
      </div>

      <p className={`text-body-md font-medium text-primary ${done ? 'line-through' : ''}`}>{task.title}</p>

      <p className="truncate text-label-sm text-on-surface-variant">담당자: {task.assigneeEmail}</p>

      <div className="mt-1 flex items-center justify-between">
        <span className="truncate text-label-sm text-on-surface-variant">
          {formatMinutesLabel(task.estimatedMinutes ?? 0)}
        </span>
        <div className="flex items-center gap-1 text-secondary">
          <Icon name="auto_awesome" className="text-sm" />
          <span className="text-label-sm font-bold">{Math.round(task.score * 100)}</span>
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({
  status,
  tasks,
  onOpenDetail,
}: {
  status: TaskStatus
  tasks: TeamTask[]
  onOpenDetail: (taskId: number) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className={`flex min-h-[260px] flex-col gap-3 rounded-2xl border border-outline-variant/15 p-3 ${COLUMN_TINT[status]}`}>
      <div className="flex items-center gap-2 border-b border-outline-variant/15 px-1 pb-3">
        <span className={`h-1.5 w-1.5 rounded-full ${COLUMN_DOT[status]}`} />
        <h4 className="text-label-md font-bold text-on-surface-variant">{COLUMN_LABEL[status]}</h4>
        <span className="text-label-sm font-medium text-on-surface-variant/50">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 rounded-xl p-1 transition-colors ${isOver ? 'bg-secondary/10' : ''}`}
      >
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-outline-variant/30 p-6 text-center text-label-sm text-on-surface-variant/60">
            비어 있음
          </p>
        ) : (
          tasks.map((task) => <KanbanCard key={task.id} task={task} onOpenDetail={onOpenDetail} />)
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ tasks, onStatusChange, onOpenDetail }: KanbanBoardProps) {
  const grouped = groupByStatus(tasks)
  // Without a distance threshold, dnd-kit treats any pointer movement (even the tiny jitter in
  // a normal click) as a drag start, which swallows the pointerup before a click event ever
  // fires — so plain clicks on a card silently never open the detail modal.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TaskStatus
    const taskId = Number(active.id)
    const task = tasks.find((candidate) => candidate.id === taskId)
    if (!task || task.status === newStatus) return
    onStatusChange(taskId, newStatus)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {BOARD_COLUMNS.map((status) => (
          <KanbanColumn key={status} status={status} tasks={grouped[status]} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </DndContext>
  )
}
