/**
 * Formata número para exibição compacta (ex: 11300 → "11.3K", 1500000 → "1.5M").
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    const n = value / 1_000_000
    return n % 1 === 0 ? `${n}M` : `${n.toFixed(1)}M`
  }
  if (value >= 1_000) {
    const n = value / 1_000
    return n % 1 === 0 ? `${n}K` : `${n.toFixed(1)}K`
  }
  return String(value)
}
