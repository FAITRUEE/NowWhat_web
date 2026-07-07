import { describe, expect, it } from 'vitest'
import {
  formatCompletedAt,
  formatMinutesLabel,
  getDDayLabel,
  isCriticalDeadline,
  isUrgentDeadline,
  toEndOfDayIso,
} from '@/lib/date'

function dateOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

describe('getDDayLabel', () => {
  it('returns 오늘까지 for a deadline today', () => {
    expect(getDDayLabel(dateOffset(0))).toBe('오늘까지')
  })

  it('returns 기한 초과 for a past deadline', () => {
    expect(getDDayLabel(dateOffset(-3))).toBe('기한 초과')
  })

  it('returns D-n for a future deadline', () => {
    expect(getDDayLabel(dateOffset(5))).toBe('D-5')
  })
})

describe('isUrgentDeadline', () => {
  it('is urgent within 2 days', () => {
    expect(isUrgentDeadline(dateOffset(2))).toBe(true)
  })

  it('is not urgent beyond 2 days', () => {
    expect(isUrgentDeadline(dateOffset(3))).toBe(false)
  })

  it('treats an overdue deadline as urgent', () => {
    expect(isUrgentDeadline(dateOffset(-1))).toBe(true)
  })
})

describe('isCriticalDeadline', () => {
  it('today is critical', () => {
    expect(isCriticalDeadline(dateOffset(0))).toBe(true)
  })

  it('tomorrow is not critical', () => {
    expect(isCriticalDeadline(dateOffset(1))).toBe(false)
  })

  it('an overdue deadline is critical', () => {
    expect(isCriticalDeadline(dateOffset(-2))).toBe(true)
  })
})

describe('toEndOfDayIso', () => {
  it('appends the end-of-day time to a date-only string', () => {
    expect(toEndOfDayIso('2026-07-15')).toBe('2026-07-15T23:59:59')
  })
})

describe('formatMinutesLabel', () => {
  it('formats minutes under an hour', () => {
    expect(formatMinutesLabel(45)).toBe('45분')
  })

  it('formats an exact number of hours', () => {
    expect(formatMinutesLabel(120)).toBe('2시간')
  })

  it('formats hours and minutes together', () => {
    expect(formatMinutesLabel(135)).toBe('2시간 15분')
  })
})

describe('formatCompletedAt', () => {
  it('formats a morning time with 오전', () => {
    expect(formatCompletedAt('2026-07-15T09:05:00')).toBe('2026.07.15 • 오전 9:05')
  })

  it('formats an afternoon time with 오후 on a 12-hour clock', () => {
    expect(formatCompletedAt('2026-07-15T14:30:00')).toBe('2026.07.15 • 오후 2:30')
  })

  it('formats noon as 오후 12', () => {
    expect(formatCompletedAt('2026-07-15T12:00:00')).toBe('2026.07.15 • 오후 12:00')
  })

  it('formats midnight as 오전 12', () => {
    expect(formatCompletedAt('2026-07-15T00:00:00')).toBe('2026.07.15 • 오전 12:00')
  })
})
