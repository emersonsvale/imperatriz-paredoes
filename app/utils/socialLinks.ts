/**
 * Normaliza valores de redes sociais (handle, número ou URL) para URLs clicáveis.
 */

export function instagramUrl(value: string): string {
  const v = value.trim()
  if (v.startsWith('http')) return v
  const handle = v.startsWith('@') ? v.slice(1) : v
  return `https://instagram.com/${handle}`
}

export function facebookUrl(value: string): string {
  const v = value.trim()
  if (v.startsWith('http')) return v
  return `https://facebook.com/${v}`
}

export function twitterUrl(value: string): string {
  const v = value.trim()
  if (v.startsWith('http')) return v
  const handle = v.startsWith('@') ? v.slice(1) : v
  return `https://x.com/${handle}`
}

/** Gera link wa.me a partir de número (apenas dígitos) ou retorna URL já informada. */
export function whatsappUrl(value: string): string {
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) return v
  const digits = v.replace(/\D/g, '')
  if (digits.length > 0) return `https://wa.me/${digits}`
  return `https://wa.me/${v}`
}
