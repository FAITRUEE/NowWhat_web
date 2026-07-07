import Icon from '@/components/ui/Icon'

const RING_RADIUS = 26
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

interface HistoryStatCardProps {
  icon: string
  iconBg: string
  iconColor: string
  accent: string
  label: string
  value: string
  progress?: number
}

export default function HistoryStatCard({
  icon,
  iconBg,
  iconColor,
  accent,
  label,
  value,
  progress,
}: HistoryStatCardProps) {
  return (
    <div className="soft-ui-card group relative flex items-center gap-6 overflow-hidden rounded-[24px] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-colors ${accent}`}
      />
      <div
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${iconColor} ${
          progress === undefined ? iconBg : ''
        }`}
      >
        {progress !== undefined && (
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={RING_RADIUS}
              fill="transparent"
              stroke="var(--color-surface-container-low)"
              strokeWidth="5"
            />
            <circle
              cx="32"
              cy="32"
              r={RING_RADIUS}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress / 100)}
            />
          </svg>
        )}
        <Icon name={icon} filled className="relative text-3xl" />
      </div>
      <div className="relative">
        <p className="mb-1 text-label-md text-on-surface-variant">{label}</p>
        <p className="whitespace-nowrap text-headline-lg leading-none font-bold text-primary">{value}</p>
      </div>
    </div>
  )
}
