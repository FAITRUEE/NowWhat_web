import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import PriorityWeightsPanel, { type ApplyState } from '@/features/weights/components/PriorityWeightsPanel'
import MotivationalQuoteCard from '@/features/weights/components/MotivationalQuoteCard'
import LivePreviewPanel from '@/features/weights/components/LivePreviewPanel'
import { calculatePreviewScore } from '@/features/weights/lib/previewScore'
import { mockPreviewTasks } from '@/features/weights/mock/previewTasksMock'
import { weightApi, type WeightPercentages } from '@/features/weights/api/weightApi'

const DEFAULT_WEIGHTS: WeightPercentages = {
  urgencyWeight: 50,
  importanceWeight: 30,
  effortWeight: 20,
}

const QUOTE = '당신의 집중력이 당신의 현실을 설계합니다. 슬라이더를 지금의 정신적 에너지 수준에 맞춰 조정해보세요.'

export default function WeightSettingsPage() {
  const queryClient = useQueryClient()
  const [weights, setWeights] = useState<WeightPercentages>(DEFAULT_WEIGHTS)
  const [hasSyncedFromServer, setHasSyncedFromServer] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const weightsQuery = useQuery({
    queryKey: ['weights'],
    queryFn: weightApi.get,
  })

  useEffect(() => {
    if (weightsQuery.data && !hasSyncedFromServer) {
      setWeights(weightsQuery.data)
      setHasSyncedFromServer(true)
    }
  }, [weightsQuery.data, hasSyncedFromServer])

  const updateMutation = useMutation({
    mutationFn: weightApi.update,
    onSuccess: (data) => {
      setWeights(data)
      queryClient.setQueryData(['weights'], data)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    },
  })

  function handleChange(key: keyof WeightPercentages, value: number) {
    setWeights((current) => ({ ...current, [key]: value }))
  }

  function handleApply() {
    updateMutation.mutate(weights)
  }

  function handleReset() {
    setWeights(DEFAULT_WEIGHTS)
  }

  const applyState: ApplyState = updateMutation.isPending ? 'saving' : showSaved ? 'saved' : 'idle'

  const { sorted, scores } = useMemo(() => {
    const scoreMap = new Map(mockPreviewTasks.map((task) => [task.id, calculatePreviewScore(task, weights)]))
    const sortedTasks = [...mockPreviewTasks].sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0))
    return { sorted: sortedTasks, scores: scoreMap }
  }, [weights])

  const momentum = Math.min(
    100,
    Math.max(20, Math.round((weights.urgencyWeight + weights.importanceWeight + weights.effortWeight) / 3 + 15)),
  )

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 p-container-padding">
      <section className="mb-10 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Icon name="tune" filled />
        </div>
        <div>
          <h2 className="mb-2 text-headline-lg text-primary">가중치 설정</h2>
          <p className="text-body-md text-on-surface-variant">알고리즘이 할 일의 우선순위를 정하는 방식을 조정하세요.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-5">
          <PriorityWeightsPanel
            weights={weights}
            onChange={handleChange}
            onApply={handleApply}
            onReset={handleReset}
            applyState={applyState}
            errorMessage={
              updateMutation.isError
                ? '가중치 저장에 실패했습니다. 다시 시도해주세요.'
                : weightsQuery.isError
                  ? '현재 가중치를 불러오지 못해 기본값을 표시하고 있습니다.'
                  : null
            }
          />
          <MotivationalQuoteCard quote={QUOTE} />
        </section>

        <section className="lg:col-span-7">
          <LivePreviewPanel tasks={sorted} scores={scores} momentum={momentum} />
        </section>
      </div>
    </div>
  )
}
