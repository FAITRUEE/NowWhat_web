import type { WeightPercentages } from '@/features/weights/api/weightApi'
import type { PreviewTask } from '@/features/weights/mock/previewTasksMock'

export function calculatePreviewScore(task: PreviewTask, weights: WeightPercentages): number {
  const effortScore = 100 - task.timeReq
  return (
    task.urgency * (weights.urgencyWeight / 100) +
    task.importance * (weights.importanceWeight / 100) +
    effortScore * (weights.effortWeight / 100)
  )
}
