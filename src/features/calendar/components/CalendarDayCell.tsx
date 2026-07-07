import type { CalendarDay } from '@/features/calendar/lib/monthGrid'
import type { CalendarEvent } from '@/features/calendar/components/CalendarGrid'

const ACCENT_STYLES: Record<CalendarEvent['accent'], string> = {
  secondary: 'bg-secondary/10 border-secondary text-secondary',
  error: 'bg-error/10 border-error text-error',
}

const MAX_VISIBLE_EVENTS = 2

interface CalendarDayCellProps {
  day: CalendarDay
  events: CalendarEvent[]
  selected: boolean
  onSelect: () => void
}

export default function CalendarDayCell({ day, events, selected, onSelect }: CalendarDayCellProps) {
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS)
  const overflowCount = events.length - visibleEvents.length

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[120px] flex-col items-start border-b border-r border-outline-variant/10 p-3 text-left transition-colors ${
        day.inCurrentMonth ? 'bg-white hover:bg-surface-container-low/60' : 'bg-surface-container-lowest/40 opacity-40'
      } ${selected ? 'bg-secondary/5 ring-2 ring-inset ring-secondary/40' : ''}`}
    >
      {day.isToday ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-label-sm font-bold text-on-secondary">
          {day.day}
        </span>
      ) : (
        <span className="text-label-sm text-on-surface-variant">{day.day}</span>
      )}
      <div className="mt-2 w-full space-y-1">
        {visibleEvents.map((event) => (
          <p
            key={event.id}
            className={`truncate rounded-md border-l-2 p-1.5 text-label-sm font-bold leading-tight ${ACCENT_STYLES[event.accent]}`}
          >
            {event.title}
          </p>
        ))}
        {overflowCount > 0 && (
          <p className="text-label-sm font-medium text-on-surface-variant">+{overflowCount}개 더보기</p>
        )}
      </div>
    </button>
  )
}
