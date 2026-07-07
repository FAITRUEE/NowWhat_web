import Icon from '@/components/ui/Icon'
import WeightSlider from '@/features/weights/components/WeightSlider'
import type { WeightPercentages } from '@/features/weights/api/weightApi'

const SLIDER_META: { key: keyof WeightPercentages; label: string; description: string }[] = [
  {
    key: 'urgencyWeight',
    label: '긴급도',
    description: '마감 기한이 임박한 할 일에 더 높은 가중치를 부여합니다. 값이 높을수록 즉각적인 처리를 우선합니다.',
  },
  {
    key: 'importanceWeight',
    label: '중요도',
    description: '마감 기한에 상관없이 영향력이 큰 목표 항목에 집중합니다.',
  },
  {
    key: 'effortWeight',
    label: '시간 효율성',
    description: '짧은 시간 안에 빠르게 끝낼 수 있는 작은 업무들을 우선적으로 배치합니다.',
  },
]

export type ApplyState = 'idle' | 'saving' | 'saved'

interface PriorityWeightsPanelProps {
  weights: WeightPercentages
  onChange: (key: keyof WeightPercentages, value: number) => void
  onApply: () => void
  onReset: () => void
  applyState: ApplyState
  errorMessage?: string | null
}

export default function PriorityWeightsPanel({
  weights,
  onChange,
  onApply,
  onReset,
  applyState,
  errorMessage,
}: PriorityWeightsPanelProps) {
  return (
    <div className="soft-ui-card space-y-8 rounded-[24px] p-8">
      <div className="flex items-center gap-2">
        <Icon name="tune" className="text-primary" />
        <h3 className="text-headline-md text-primary">우선순위 로직</h3>
      </div>

      <div className="space-y-8">
        {SLIDER_META.map((meta) => (
          <WeightSlider
            key={meta.key}
            label={meta.label}
            description={meta.description}
            value={weights[meta.key]}
            onChange={(value) => onChange(meta.key, value)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={applyState === 'saving'}
          className="soft-extrusion flex-1 rounded-xl border border-outline-variant/50 bg-white py-4 text-label-md font-bold text-primary transition-all hover:bg-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={applyState === 'saving'}
          className={`flex flex-[2] items-center justify-center gap-2 rounded-xl py-4 text-label-md font-bold text-on-primary shadow-md transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed ${
            applyState === 'saved' ? 'bg-secondary' : 'bg-primary'
          }`}
        >
          {applyState === 'saved' ? (
            <>
              <span>설정 저장됨!</span>
              <Icon name="done_all" />
            </>
          ) : applyState === 'saving' ? (
            <span>적용 중...</span>
          ) : (
            <>
              <span>가중치 적용</span>
              <Icon name="check_circle" />
            </>
          )}
        </button>
      </div>
      {errorMessage && <p className="text-center text-label-sm font-bold text-error">{errorMessage}</p>}
    </div>
  )
}
