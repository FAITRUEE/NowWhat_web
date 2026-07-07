import CalendarDayCell from '@/features/calendar/components/CalendarDayCell'
import type { CalendarDay } from '@/features/calendar/lib/monthGrid'

export interface CalendarEvent {
  id: number
  title: string
  accent: 'secondary' | 'error'
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarGridProps {
  days: CalendarDay[]
  eventsByDate: Record<string, CalendarEvent[]>
  selectedKey: string
  onSelect: (key: string) => void
}

export default function CalendarGrid({ days, eventsByDate, selectedKey, onSelect }: CalendarGridProps) {
  return (
    <div className="soft-ui-card grid grid-cols-7 overflow-hidden rounded-[24px] border border-outline-variant/20">
      {WEEKDAY_LABELS.map((label) => (
        <div
          key={label}
          className="border-b border-outline-variant/30 bg-surface-container-low py-4 text-center text-label-md font-bold text-on-surface-variant"
        >
          {label}
        </div>
      ))}
      {days.map((day) => (
        <CalendarDayCell
          key={day.key}
          day={day}
          events={eventsByDate[day.key] ?? []}
          selected={day.key === selectedKey}
          onSelect={() => onSelect(day.key)}
        />
      ))}
    </div>
  )
}
