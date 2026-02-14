/**
 * Formata uma data ISO para texto relativo (Ontem, X dias atrás).
 */
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Agora'
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays <= 7) return `${diffDays} dias atrás`
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} semana(s) atrás`
  if (diffDays <= 365) return `${Math.floor(diffDays / 30)} mês(es) atrás`
  return `${Math.floor(diffDays / 365)} ano(s) atrás`
}
