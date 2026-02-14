/**
 * Lista os últimos CDs publicados (para a home e listagens públicas).
 * Usa cliente público (anon) para garantir dados no SSR.
 */
import { getSupabasePublic } from '~~/server/utils/supabasePublic'

export interface LatestCdItem {
  id: string
  titulo: string
  created_at: string
  capa_url: string | null
  artista: string
}

const empty = { items: [] as LatestCdItem[] }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 12, 24)

  let supabase
  try {
    supabase = getSupabasePublic()
  } catch (e) {
    console.error('[api/cds/latest]', e)
    return empty
  }

  const { data: rows, error } = await supabase
    .from('cd')
    .select('id, titulo, created_at, capa_url, perfil_id')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[api/cds/latest]', error.message)
    return empty
  }

  const ids = [...new Set((rows ?? []).map((r: { perfil_id: string }) => r.perfil_id))]
  let names: Record<string, string> = {}
  if (ids.length > 0) {
    const { data: perfis } = await supabase.from('perfil').select('id, nome').in('id', ids)
    if (perfis) {
      for (const p of perfis as { id: string; nome: string | null }[]) {
        names[p.id] = p.nome ?? 'Artista'
      }
    }
  }

  const items: LatestCdItem[] = (rows ?? []).map((row: { id: string; titulo: string | null; created_at: string; capa_url: string | null; perfil_id: string }) => ({
    id: row.id,
    titulo: row.titulo ?? '',
    created_at: row.created_at ?? '',
    capa_url: row.capa_url ?? null,
    artista: names[row.perfil_id] ?? 'Artista',
  }))

  return { items }
})
