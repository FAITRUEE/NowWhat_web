import PreviewTaskRow from '@/features/weights/components/PreviewTaskRow'
import type { PreviewTask } from '@/features/weights/mock/previewTasksMock'

const LEGEND_DOTS = ['bg-error', 'bg-primary', 'bg-secondary']

interface LivePreviewPanelProps {
  tasks: PreviewTask[]
  scores: Map<number, number>
  momentum: number
}

export default function LivePreviewPanel({ tasks, scores, momentum }: LivePreviewPanelProps) {
  return (
    <div className="glass-card flex h-full min-h-[600px] flex-col rounded-[24px] p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h3 className="text-headline-md text-primary">실시간 미리보기</h3>
          <p className="text-label-md text-on-surface-variant">가중치에 따라 즉시 재정렬됩니다.</p>
        </div>
        <div className="flex gap-2">
          {LEGEND_DOTS.map((color) => (
            <span key={color} className={`h-3 w-3 rounded-full ${color}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {tasks.map((task, index) => (
          <PreviewTaskRow key={task.id} task={task} score={scores.get(task.id) ?? 0} faded={index > 3} />
        ))}
      </div>

      <div className="mt-8 border-t border-outline-variant/30 pt-8">
        <div className="mb-2 flex items-center justify-between text-on-surface-variant">
          <span className="text-label-sm font-bold uppercase tracking-widest">집중 모멘텀</span>
          <span className="text-label-sm font-bold">예상 몰입도: {momentum}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${momentum}%` }}
          />
        </div>
      </div>
    </div>
  )
}
