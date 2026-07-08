function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function diffInDays(deadline: string): number {
  const today = startOfDay(new Date())
  const target = startOfDay(new Date(deadline))
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getDDayLabel(deadline: string): string {
  const diff = diffInDays(deadline)
  if (diff === 0) return '오늘까지'
  if (diff < 0) return '기한 초과'
  return `D-${diff}`
}

export function isUrgentDeadline(deadline: string): boolean {
  return diffInDays(deadline) <= 2
}

export function isCriticalDeadline(deadline: string): boolean {
  return diffInDays(deadline) <= 0
}

export function toEndOfDayIso(dateOnly: string): string {
  return `${dateOnly}T23:59:59`
}

export function formatMinutesLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}분`
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}

export function isCompletedOnTime(completedAt: string, deadline: string): boolean {
  return new Date(completedAt).getTime() <= new Date(deadline).getTime()
}

export function formatCompletedAt(dateTime: string): string {
  const date = new Date(dateTime)
  const dateLabel = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  const hours = date.getHours()
  const period = hours < 12 ? '오전' : '오후'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const timeLabel = `${period} ${hour12}:${String(date.getMinutes()).padStart(2, '0')}`
  return `${dateLabel} • ${timeLabel}`
}
