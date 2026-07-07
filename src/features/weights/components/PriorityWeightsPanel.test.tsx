import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PriorityWeightsPanel from '@/features/weights/components/PriorityWeightsPanel'
import type { WeightPercentages } from '@/features/weights/api/weightApi'

const weights: WeightPercentages = { urgencyWeight: 70, importanceWeight: 20, effortWeight: 10 }

describe('PriorityWeightsPanel', () => {
  it('calls onReset (not onApply) when the 초기화 button is clicked', () => {
    const onReset = vi.fn()
    const onApply = vi.fn()

    render(
      <PriorityWeightsPanel
        weights={weights}
        onChange={vi.fn()}
        onApply={onApply}
        onReset={onReset}
        applyState="idle"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '초기화' }))

    expect(onReset).toHaveBeenCalledTimes(1)
    expect(onApply).not.toHaveBeenCalled()
  })

  it('disables both buttons while saving', () => {
    render(
      <PriorityWeightsPanel
        weights={weights}
        onChange={vi.fn()}
        onApply={vi.fn()}
        onReset={vi.fn()}
        applyState="saving"
      />,
    )

    expect(screen.getByRole('button', { name: '초기화' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '적용 중...' })).toBeDisabled()
  })
})
