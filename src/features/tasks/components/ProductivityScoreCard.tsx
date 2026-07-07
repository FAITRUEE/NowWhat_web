import Icon from '@/components/ui/Icon'

interface ProductivityScoreCardProps {
  score: number
  deltaLabel: string
  comparisonLabel: string
}

const RADIUS = 58
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProductivityScoreCard({
  score,
  deltaLabel,
  comparisonLabel,
}: ProductivityScoreCardProps) {
  const dashOffset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[32px] p-8 glass-card">
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-secondary/15 blur-3xl transition-colors group-hover:bg-secondary/25" />
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Icon name="insights" filled />
        </div>
        <h4 className="text-headline-md text-primary">정시 완료율</h4>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="transparent"
              stroke="var(--color-surface-container-low)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="transparent"
              stroke="url(#gradient-prod)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
            <defs>
              <linearGradient id="gradient-prod" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-secondary)" />
                <stop offset="100%" stopColor="var(--color-secondary-container)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-headline-lg font-bold text-primary">{score}</span>
            <span className="text-label-sm font-bold text-secondary">{deltaLabel}</span>
          </div>
        </div>
        <p className="mt-6 text-center text-label-md text-on-surface-variant">{comparisonLabel}</p>
      </div>
    </div>
  )
}
