import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import UrgentItemsCard from '@/features/tasks/components/UrgentItemsCard'

describe('UrgentItemsCard', () => {
  it('shows an empty-state message when there are no urgent items', () => {
    render(<UrgentItemsCard items={[]} />)

    expect(screen.getByText('긴급한 항목이 없어요.')).toBeInTheDocument()
  })

  it('renders each item with its title and time label', () => {
    render(
      <UrgentItemsCard
        items={[
          { id: 1, title: '클라이언트 미팅 준비', timeLabel: '오늘까지', critical: true },
          { id: 2, title: '문서 검토', timeLabel: 'D-1' },
        ]}
      />,
    )

    expect(screen.getByText('클라이언트 미팅 준비')).toBeInTheDocument()
    expect(screen.getByText('오늘까지')).toBeInTheDocument()
    expect(screen.getByText('문서 검토')).toBeInTheDocument()
    expect(screen.getByText('D-1')).toBeInTheDocument()
    expect(screen.queryByText('긴급한 항목이 없어요.')).not.toBeInTheDocument()
  })
})
