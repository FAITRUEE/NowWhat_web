function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function getEmailFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const claims = JSON.parse(base64UrlDecode(payload)) as { email?: unknown }
    return typeof claims.email === 'string' ? claims.email : null
  } catch {
    return null
  }
}
