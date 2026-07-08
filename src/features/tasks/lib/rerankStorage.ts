import { getEmailFromToken } from '@/lib/jwt'

// Scoped per-user (by JWT email claim) so a different account logging in on the
// same browser doesn't inherit another user's AI-rerank order/reasons, and so the
// same user's rerank state survives logout -> login (and a full page reload),
// not just in-app navigation.
function storageKey(kind: 'taskOrder' | 'rerankReasons'): string | null {
  const token = localStorage.getItem('accessToken')
  const email = token ? getEmailFromToken(token) : null
  if (!email) return null
  return `nowwhat:${kind}:${email}`
}

function load<T>(kind: 'taskOrder' | 'rerankReasons'): T | null {
  const key = storageKey(kind)
  if (!key) return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function save(kind: 'taskOrder' | 'rerankReasons', value: unknown): void {
  const key = storageKey(kind)
  if (!key) return
  if (value == null) {
    localStorage.removeItem(key)
    return
  }
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadTaskOrder(): number[] | null {
  return load<number[]>('taskOrder')
}

export function saveTaskOrder(order: number[] | null): void {
  save('taskOrder', order)
}

export function loadRerankReasons(): Record<number, string> | null {
  return load<Record<number, string>>('rerankReasons')
}

export function saveRerankReasons(reasons: Record<number, string> | null): void {
  save('rerankReasons', reasons)
}
