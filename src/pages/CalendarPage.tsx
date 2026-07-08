import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CalendarToolbar from '@/features/calendar/components/CalendarToolbar'
import CalendarGrid, { type CalendarEvent } from '@/features/calendar/components/CalendarGrid'
import TodayTaskList, { type TodayTask } from '@/features/calendar/components/TodayTaskList'
import AddTaskModal, { type NewTaskInput } from '@/features/tasks/components/AddTaskModal'
import { taskApi } from '@/features/tasks/api/taskApi'
import { buildMonthGrid, toKey } from '@/features/calendar/lib/monthGrid'
import { formatMinutesLabel, isCompletedOnTime, toEndOfDayIso } from '@/lib/date'
import type { Task } from '@/types/task'

const TODAY = new Date()
const TODAY_KEY = toKey(TODAY)
const TODAY_DATE_LABEL = TODAY.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

function accentForImportance(importance: number): CalendarEvent['accent'] {
  if (importance >= 4) return 'error'
  if (importance === 3) return 'secondary'
  return 'neutral'
}

function priorityForImportance(importance: number): TodayTask['priority'] {
  if (importance >= 4) return 'high'
  if (importance === 3) return 'medium'
  return 'low'
}

function toCalendarEvent(task: Task): CalendarEvent {
  return { id: task.id, title: task.title, accent: accentForImportance(task.importance) }
}

// The "오늘의 할 일" panel intentionally includes overdue-but-still-open tasks (see
// TaskService.matchesView's TODAY case on the backend) so they don't get lost — but
// that makes almost every item there technically "overdue," so the 완료되지 않음 badge
// is only meaningful when looking at a specific past date, not the today panel itself.
function toDayTask(task: Task, showOverdue: boolean): TodayTask {
  const done = task.status === 'DONE'
  return {
    id: task.id,
    title: task.title,
    description: task.description || '설명 없음',
    priority: priorityForImportance(task.importance),
    timeLabel: task.estimatedMinutes ? `예상 ${formatMinutesLabel(task.estimatedMinutes)}` : '시간 미정',
    done,
    // Task has no dedicated completedAt — updatedAt is the last mutation, which for a
    // DONE task is the complete() call, so it doubles as a completion timestamp here.
    completedLate: done && !isCompletedOnTime(task.updatedAt, task.deadline),
    overdue: showOverdue && !done && new Date(task.deadline).getTime() < Date.now(),
  }
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selectedKey, setSelectedKey] = useState(TODAY_KEY)
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const days = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth(), TODAY), [cursor])
  const rangeFrom = toKey(days[0].date)
  const rangeTo = toKey(days[days.length - 1].date)
  const monthLabel = `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`

  const isTodaySelected = selectedKey === TODAY_KEY
  const selectedDate = new Date(`${selectedKey}T00:00:00`)
  const selectedDateLabel = selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const calendarQuery = useQuery({
    queryKey: ['tasks', 'calendar', rangeFrom, rangeTo],
    queryFn: () => taskApi.calendar(rangeFrom, rangeTo),
  })

  // Not gated on isTodaySelected — the grid's today cell (below) needs this
  // regardless of which day is currently selected in the side panel.
  const todayQuery = useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: () => taskApi.list('today'),
  })

  const createMutation = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setAddModalOpen(false)
    },
  })

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {}
    for (const task of calendarQuery.data ?? []) {
      const key = task.deadline.slice(0, 10)
      grouped[key] = [...(grouped[key] ?? []), toCalendarEvent(task)]
    }
    // The "오늘의 할 일" panel rolls overdue-but-still-open tasks forward into today
    // (backend TODAY view: deadline <= today, not done) — mirror that here so today's
    // grid cell isn't missing items that visibly appear in that panel. Tasks actually
    // due today are already in `grouped[TODAY_KEY]` from calendarQuery above; only add
    // the rolled-forward ones that aren't there yet, without removing them from their
    // original (past) date so that date still shows what was due there.
    const alreadyOnToday = new Set((grouped[TODAY_KEY] ?? []).map((event) => event.id))
    const rolledOverToday = (todayQuery.data ?? [])
      .filter((task) => !alreadyOnToday.has(task.id))
      .map(toCalendarEvent)
    if (rolledOverToday.length > 0) {
      grouped[TODAY_KEY] = [...(grouped[TODAY_KEY] ?? []), ...rolledOverToday]
    }
    return grouped
  }, [calendarQuery.data, todayQuery.data])

  const selectedDayTasks = useMemo(
    () => (calendarQuery.data ?? []).filter((task) => task.deadline.slice(0, 10) === selectedKey),
    [calendarQuery.data, selectedKey],
  )

  const panelTitle = isTodaySelected
    ? '오늘의 할 일'
    : `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 할 일`
  const panelTasks = isTodaySelected
    ? (todayQuery.data ?? []).map((task) => toDayTask(task, false))
    : selectedDayTasks.map((task) => toDayTask(task, true))

  function handlePrevMonth() {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  function handleNextMonth() {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  function handleToday() {
    setCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
    setSelectedKey(TODAY_KEY)
  }

  function handleAddTask(input: NewTaskInput) {
    createMutation.mutate({
      title: input.title,
      description: input.description || undefined,
      deadline: toEndOfDayIso(input.deadline),
      importance: input.importance,
      estimatedMinutes: input.estimatedMinutes,
    })
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl flex-1 p-container-padding">
        <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[1fr_320px]">
          <section>
            <CalendarToolbar
              monthLabel={monthLabel}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
            />
            <CalendarGrid days={days} eventsByDate={eventsByDate} selectedKey={selectedKey} onSelect={setSelectedKey} />
          </section>

          <section className="glass-card h-fit rounded-[24px] p-6">
            <TodayTaskList
              title={panelTitle}
              dateLabel={isTodaySelected ? TODAY_DATE_LABEL : selectedDateLabel}
              tasks={panelTasks}
              onAddClick={() => setAddModalOpen(true)}
            />
          </section>
        </div>
      </div>
      <AddTaskModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddTask}
        defaultDeadline={selectedKey}
      />
    </>
  )
}
