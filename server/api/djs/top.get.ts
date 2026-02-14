/**
 * Lista os top DJs (perfis com CDs), agregando por perfil_id:
 * quantidade de CDs, total de plays e total de downloads.
 * Ordenado por total de plays (desc). Usa cliente público para SSR.
 */
import { getSupabasePublic } from '~~/server/utils/supabasePublic'

export interface TopDjItem {
  id: string
  nome: string
  foto_perfil: string | null
  cdCount: number
  playsCount: number
  downloadsCount: number
}

const empty = { items: [] as TopDjItem[] }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 10, 100)

  let supabase
  try {
    supabase = getSupabasePublic()
  } catch (e) {
    console.error('[api/djs/top]', e)
    return empty
  }

  const { data: cdRows, error: cdError } = await supabase
    .from('cd')
    .select('perfil_id, plays_count, downloads_count')

  if (cdError) {
    console.error('[api/djs/top]', cdError.message)
    return empty
  }

  type Row = { perfil_id: string; plays_count: number; downloads_count: number }
  const byPerfil = new Map<string, { plays: number; downloads: number }>()
  for (const row of cdRows ?? []) {
    const r = row as Row
    const key = r.perfil_id
    const cur = byPerfil.get(key) ?? { plays: 0, downloads: 0 }
    byPerfil.set(key, {
      plays: cur.plays + (r.plays_count ?? 0),
      downloads: cur.downloads + (r.downloads_count ?? 0),
    })
  }

  const aggregated = Array.from(byPerfil.entries()).map(([perfilId, stats]) => ({
    perfil_id: perfilId,
    cdCount: (cdRows ?? []).filter((r: Row) => r.perfil_id === perfilId).length,
    playsCount: stats.plays,
    downloadsCount: stats.downloads,
  }))

  aggregated.sort((a, b) => b.playsCount - a.playsCount)
  const top = aggregated.slice(0, limit)
  const perfilIds = top.map((t) => t.perfil_id)

  if (perfilIds.length === 0) {
    return { items: [] }
  }

  const { data: perfis, error: perfisError } = await supabase
    .from('perfil')
    .select('id, nome, foto_perfil')
    .in('id', perfilIds)

  if (perfisError) {
    console.error('[api/djs/top] perfis', perfisError.message)
    return empty
  }

  const perfilMap = new Map(
    (perfis ?? []).map((p: { id: string; nome: string | null; foto_perfil: string | null }) => [
      p.id,
      { nome: p.nome ?? 'Artista', foto_perfil: p.foto_perfil ?? null },
    ])
  )

  const items: TopDjItem[] = top.map((t) => {
    const p = perfilMap.get(t.perfil_id)
    return {
      id: t.perfil_id,
      nome: p?.nome ?? 'Artista',
      foto_perfil: p?.foto_perfil ?? null,
      cdCount: t.cdCount,
      playsCount: t.playsCount,
      downloadsCount: t.downloadsCount,
    }
  })

  return { items }
})
