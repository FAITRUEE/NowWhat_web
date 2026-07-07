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
