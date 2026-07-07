import type { TaskView } from '@/types/task'

const VIEW_OPTIONS: { value: TaskView; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'all', label: '전체' },
]

interface ViewTabsProps {
  value: TaskView
  onChange: (view: TaskView) => void
}

export default function ViewTabs({ value, onChange }: ViewTabsProps) {
  return (
    <nav className="inline-flex rounded-full border border-outline-variant/20 bg-surface-container-high/40 p-1">
      {VIEW_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-6 py-1.5 text-label-md transition-all ${
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
