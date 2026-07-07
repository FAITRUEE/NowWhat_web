import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function toDateOnly(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => (value ? parseDateOnly(value) : new Date()))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = toDateOnly(new Date())

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function selectDay(day: number) {
    onChange(toDateOnly(new Date(year, month, day)))
    setOpen(false)
  }

  const label = value
    ? `${parseDateOnly(value).getFullYear()}년 ${parseDateOnly(value).getMonth() + 1}월 ${parseDateOnly(value).getDate()}일`
    : '날짜 선택'

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 rounded-xl border border-outline-variant/30 bg-white py-3 pl-4 pr-4 text-left text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50"
      >
        <Icon name="calendar_today" className="text-on-surface-variant" />
        <span className={value ? '' : 'text-outline-variant'}>{label}</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-72 rounded-xl border border-outline-variant/20 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant"
            >
              <Icon name="chevron_left" />
            </button>
            <span className="text-label-md font-bold text-primary">
              {year}년 {month + 1}월
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant"
            >
              <Icon name="chevron_right" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAY_LABELS.map((weekday) => (
              <span key={weekday} className="py-1 text-label-sm text-on-surface-variant opacity-60">
                {weekday}
              </span>
            ))}
            {cells.map((day, index) => {
              if (day == null) return <span key={index} />
              const dateStr = toDateOnly(new Date(year, month, day))
              const isSelected = dateStr === value
              const isToday = dateStr === todayStr
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`rounded-full py-1.5 text-label-sm transition-colors ${
                    isSelected
                      ? 'bg-secondary font-bold text-white'
                      : isToday
                        ? 'font-bold text-secondary'
                        : 'text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
