import { describe, expect, it } from 'vitest'
import { calculatePreviewScore } from '@/features/weights/lib/previewScore'
import type { PreviewTask } from '@/features/weights/mock/previewTasksMock'
import type { WeightPercentages } from '@/features/weights/api/weightApi'

const task: PreviewTask = {
  id: 1,
  title: '테스트 과업',
  tag: '테스트',
  dDay: 'D-1',
  urgency: 80,
  importance: 40,
  timeReq: 30,
  accent: 'error',
}

describe('calculatePreviewScore', () => {
  it('weights each factor by its percentage and inverts timeReq into an effort score', () => {
    const weights: WeightPercentages = { urgencyWeight: 50, importanceWeight: 30, effortWeight: 20 }

    // urgency: 80 * 0.5 = 40, importance: 40 * 0.3 = 12, effort: (100-30) * 0.2 = 14 -> 66
    expect(calculatePreviewScore(task, weights)).toBeCloseTo(66, 5)
  })

  it('returns 0 when every weight is 0', () => {
    const weights: WeightPercentages = { urgencyWeight: 0, importanceWeight: 0, effortWeight: 0 }

    expect(calculatePreviewScore(task, weights)).toBe(0)
  })

  it('isolates a single factor when only its weight is non-zero', () => {
    const urgencyOnly: WeightPercentages = { urgencyWeight: 100, importanceWeight: 0, effortWeight: 0 }

    expect(calculatePreviewScore(task, urgencyOnly)).toBe(task.urgency)
  })

  it('rewards a shorter timeReq with a higher effort-driven score', () => {
    const effortOnly: WeightPercentages = { urgencyWeight: 0, importanceWeight: 0, effortWeight: 100 }
    const quickerTask: PreviewTask = { ...task, timeReq: 10 }

    expect(calculatePreviewScore(quickerTask, effortOnly)).toBeGreaterThan(
      calculatePreviewScore(task, effortOnly),
    )
  })
})
