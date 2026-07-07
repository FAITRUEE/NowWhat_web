export interface CalendarDay {
  date: Date
  day: number
  inCurrentMonth: boolean
  isToday: boolean
  key: string
}

export function toKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function buildMonthGrid(year: number, month: number, today: Date): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: CalendarDay[] = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(year, month - 1, day)
    cells.push({ date, day, inCurrentMonth: false, isToday: false, key: toKey(date) })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    cells.push({ date, day, inCurrentMonth: true, isToday: isSameDay(date, today), key: toKey(date) })
  }

  const remainder = cells.length % 7
  const trailingNeeded = remainder === 0 ? 0 : 7 - remainder
  for (let day = 1; day <= trailingNeeded; day++) {
    const date = new Date(year, month + 1, day)
    cells.push({ date, day, inCurrentMonth: false, isToday: false, key: toKey(date) })
  }

  return cells
}
