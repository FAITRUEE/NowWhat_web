import Icon from '@/components/ui/Icon'

interface CalendarToolbarProps {
  monthLabel: string
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export default function CalendarToolbar({ monthLabel, onPrevMonth, onNextMonth, onToday }: CalendarToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <h2 className="text-headline-lg text-primary">{monthLabel}</h2>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95"
        >
          <Icon name="chevron_left" />
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95"
        >
          <Icon name="chevron_right" />
        </button>
      </div>
      <button
        type="button"
        onClick={onToday}
        className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-label-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high"
      >
        오늘
      </button>
    </div>
  )
}
