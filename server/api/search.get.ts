/**
 * Busca pública por CDs (título) e DJs (nome).
 * GET /api/search?q=termo
 */
import { getSupabasePublic } from '~~/server/utils/supabasePublic'

export interface SearchCdItem {
  id: string
  titulo: string
  created_at: string
  capa_url: string | null
  artista: string
}

export interface SearchDjItem {
  id: string
  nome: string
  foto_perfil: string | null
  cdCount: number
  playsCount: number
  downloadsCount: number
}

const empty = { cds: [] as SearchCdItem[], djs: [] as SearchDjItem[] }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim() : ''
  if (!q) return empty

  let supabase
  try {
    supabase = getSupabasePublic()
  } catch (e) {
    console.error('[api/search]', e)
    return empty
  }

  const term = `%${q}%`
  const cdLimit = 24
  const djLimit = 10

  const [cdResult, perfilIdsWithCdsResult] = await Promise.all([
    supabase
      .from('cd')
      .select('id, titulo, created_at, capa_url, perfil_id')
      .ilike('titulo', term)
      .order('created_at', { ascending: false })
      .limit(cdLimit),
    supabase.from('cd').select('perfil_id'),
  ])

  if (cdResult.error) {
    console.error('[api/search] cds', cdResult.error.message)
    return empty
  }

  const cdRows = cdResult.data ?? []
  const perfilIdsWithCds = [...new Set((perfilIdsWithCdsResult.data ?? []).map((r: { perfil_id: string }) => r.perfil_id))]

  let names: Record<string, string> = {}
  if (cdRows.length > 0) {
    const ids = [...new Set(cdRows.map((r: { perfil_id: string }) => r.perfil_id))]
    const { data: perfis } = await supabase.from('perfil').select('id, nome').in('id', ids)
    if (perfis) {
      for (const p of perfis as { id: string; nome: string | null }[]) {
        names[p.id] = p.nome ?? 'Artista'
      }
    }
  }

  const cds: SearchCdItem[] = cdRows.map((row: { id: string; titulo: string | null; created_at: string; capa_url: string | null; perfil_id: string }) => ({
    id: row.id,
    titulo: row.titulo ?? '',
    created_at: row.created_at ?? '',
    capa_url: row.capa_url ?? null,
    artista: names[row.perfil_id] ?? 'Artista',
  }))

  if (perfilIdsWithCds.length === 0) {
    return { cds, djs: [] }
  }

  const { data: djRows, error: djError } = await supabase
    .from('perfil')
    .select('id, nome, foto_perfil')
    .in('id', perfilIdsWithCds)
    .ilike('nome', term)
    .limit(djLimit)

  if (djError || !djRows?.length) {
    return { cds, djs: [] }
  }

  const djIds = (djRows as { id: string }[]).map((r) => r.id)
  const { data: cdAgg } = await supabase.from('cd').select('perfil_id, plays_count, downloads_count').in('perfil_id', djIds)

  type CdRow = { perfil_id: string; plays_count: number; downloads_count: number }
  const byPerfil = new Map<string, { cdCount: number; plays: number; downloads: number }>()
  for (const row of cdAgg ?? []) {
    const r = row as CdRow
    const cur = byPerfil.get(r.perfil_id) ?? { cdCount: 0, plays: 0, downloads: 0 }
    byPerfil.set(r.perfil_id, {
      cdCount: cur.cdCount + 1,
      plays: cur.plays + (r.plays_count ?? 0),
      downloads: cur.downloads + (r.downloads_count ?? 0),
    })
  }

  const djs: SearchDjItem[] = (djRows as { id: string; nome: string | null; foto_perfil: string | null }[]).map((p) => {
    const stats = byPerfil.get(p.id) ?? { cdCount: 0, plays: 0, downloads: 0 }
    return {
      id: p.id,
      nome: p.nome ?? 'DJ',
      foto_perfil: p.foto_perfil ?? null,
      cdCount: stats.cdCount,
      playsCount: stats.plays,
      downloadsCount: stats.downloads,
    }
  })

  return { cds, djs }
})
