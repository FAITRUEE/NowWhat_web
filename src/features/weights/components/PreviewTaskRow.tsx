import type { PreviewTask } from '@/features/weights/mock/previewTasksMock'

const ACCENT_BAR: Record<PreviewTask['accent'], string> = {
  error: 'bg-error',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
}

interface PreviewTaskRowProps {
  task: PreviewTask
  score: number
  faded?: boolean
}

export default function PreviewTaskRow({ task, score, faded }: PreviewTaskRowProps) {
  return (
    <div
      className={`group flex items-center justify-between rounded-xl border border-outline-variant/20 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary ${
        faded ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`h-10 w-1.5 shrink-0 rounded-full ${ACCENT_BAR[task.accent]}`} />
        <div>
          <h4 className="text-body-lg font-semibold text-primary transition-colors group-hover:text-secondary">
            {task.title}
          </h4>
          <div className="mt-1 flex items-center gap-3">
            <span className="rounded bg-surface-container px-2 py-0.5 text-label-sm text-on-surface-variant">
              {task.tag}
            </span>
            <span className="text-label-sm font-bold text-error">{task.dDay}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">우선순위</p>
        <p className="text-headline-md text-primary">{Math.round(score)}</p>
      </div>
    </div>
  )
}
