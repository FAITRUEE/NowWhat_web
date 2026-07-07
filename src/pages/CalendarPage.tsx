import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CalendarToolbar from '@/features/calendar/components/CalendarToolbar'
import CalendarGrid, { type CalendarEvent } from '@/features/calendar/components/CalendarGrid'
import TodayTaskList, { type TodayTask } from '@/features/calendar/components/TodayTaskList'
import AddTaskModal, { type NewTaskInput } from '@/features/tasks/components/AddTaskModal'
import { taskApi } from '@/features/tasks/api/taskApi'
import { buildMonthGrid, toKey } from '@/features/calendar/lib/monthGrid'
import { formatMinutesLabel, toEndOfDayIso } from '@/lib/date'
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
  return importance >= 4 ? 'error' : 'secondary'
}

function priorityForImportance(importance: number): TodayTask['priority'] {
  if (importance >= 4) return 'high'
  if (importance === 3) return 'medium'
  return 'low'
}

function toCalendarEvent(task: Task): CalendarEvent {
  return { id: task.id, title: task.title, accent: accentForImportance(task.importance) }
}

function toDayTask(task: Task): TodayTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '설명 없음',
    priority: priorityForImportance(task.importance),
    timeLabel: task.estimatedMinutes ? `예상 ${formatMinutesLabel(task.estimatedMinutes)}` : '시간 미정',
    done: task.status === 'DONE',
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

  const todayQuery = useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: () => taskApi.list('today'),
    enabled: isTodaySelected,
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
    return grouped
  }, [calendarQuery.data])

  const selectedDayTasks = useMemo(
    () => (calendarQuery.data ?? []).filter((task) => task.deadline.slice(0, 10) === selectedKey),
    [calendarQuery.data, selectedKey],
  )

  const panelTitle = isTodaySelected
    ? '오늘의 할 일'
    : `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 할 일`
  const panelTasks = isTodaySelected ? (todayQuery.data ?? []).map(toDayTask) : selectedDayTasks.map(toDayTask)

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
