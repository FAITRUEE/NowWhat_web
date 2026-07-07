export type HistoryPeriod = 'week' | 'month'

const PERIOD_OPTIONS: { value: HistoryPeriod; label: string }[] = [
  { value: 'week', label: '주간' },
  { value: 'month', label: '월간' },
]

interface HistoryPeriodTabsProps {
  value: HistoryPeriod
  onChange: (period: HistoryPeriod) => void
}

export default function HistoryPeriodTabs({ value, onChange }: HistoryPeriodTabsProps) {
  return (
    <nav className="inline-flex rounded-xl bg-surface-container-low p-1">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-6 py-2 text-label-md transition-all ${
            value === option.value
              ? 'bg-white font-bold text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </nav>
  )
}
