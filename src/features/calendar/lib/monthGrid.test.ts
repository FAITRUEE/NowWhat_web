import { describe, expect, it } from 'vitest'
import { buildMonthGrid, toKey } from '@/features/calendar/lib/monthGrid'

describe('toKey', () => {
  it('formats a date as zero-padded yyyy-mm-dd', () => {
    expect(toKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toKey(new Date(2026, 11, 25))).toBe('2026-12-25')
  })
})

describe('buildMonthGrid', () => {
  it('builds a July 2026 grid with the correct leading/trailing days', () => {
    // July 1, 2026 is a Wednesday, so the grid should lead with Jun 28-30.
    const grid = buildMonthGrid(2026, 6, new Date(2026, 6, 7))

    expect(grid).toHaveLength(35)

    expect(grid[0]).toMatchObject({ day: 28, inCurrentMonth: false })
    expect(grid[1]).toMatchObject({ day: 29, inCurrentMonth: false })
    expect(grid[2]).toMatchObject({ day: 30, inCurrentMonth: false })

    expect(grid[3]).toMatchObject({ day: 1, inCurrentMonth: true })
    expect(grid[3].date.getMonth()).toBe(6)

    const last = grid[grid.length - 1]
    expect(last).toMatchObject({ day: 1, inCurrentMonth: false })
    expect(last.date.getMonth()).toBe(7)
  })

  it('marks exactly the matching date as isToday', () => {
    const today = new Date(2026, 6, 7)
    const grid = buildMonthGrid(2026, 6, today)

    const todayCells = grid.filter((cell) => cell.isToday)
    expect(todayCells).toHaveLength(1)
    expect(todayCells[0]).toMatchObject({ day: 7, inCurrentMonth: true })
  })

  it('never flags a leading/trailing day as today, even when the day number matches', () => {
    // "today" is the 1st of the displayed month; adjacent-month 1st cells must stay unflagged.
    const today = new Date(2026, 6, 1)
    const grid = buildMonthGrid(2026, 6, today)

    const todayCells = grid.filter((cell) => cell.isToday)
    expect(todayCells).toHaveLength(1)
    expect(todayCells[0].inCurrentMonth).toBe(true)
  })

  it('always produces a whole number of 7-day weeks, across different month lengths', () => {
    const cases: [number, number][] = [
      [2026, 0], // January
      [2026, 1], // February (non-leap)
      [2024, 1], // February (leap)
      [2026, 6], // July
    ]

    for (const [year, month] of cases) {
      const grid = buildMonthGrid(year, month, new Date(year, month, 1))
      expect(grid.length % 7).toBe(0)

      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const currentMonthCells = grid.filter((cell) => cell.inCurrentMonth)
      expect(currentMonthCells).toHaveLength(daysInMonth)
      expect(currentMonthCells[0].day).toBe(1)
      expect(currentMonthCells[currentMonthCells.length - 1].day).toBe(daysInMonth)
    }
  })
})
