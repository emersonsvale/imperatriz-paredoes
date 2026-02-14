/**
 * Lista os CDs mais baixados (top 10 por downloads_count).
 * Usado na seção "Top 10 Downloads" da home.
 * Usa cliente público para garantir dados no SSR.
 */
import { getSupabasePublic } from '~~/server/utils/supabasePublic'

export interface TopDownloadItem {
  id: string
  titulo: string
  capa_url: string | null
  artista: string
  downloads_count: number
}

const empty = { items: [] as TopDownloadItem[] }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 10, 20)

  let supabase
  try {
    supabase = getSupabasePublic()
  } catch (e) {
    console.error('[api/cds/top-downloads]', e)
    return empty
  }

  const { data: rows, error } = await supabase
    .from('cd')
    .select('id, titulo, capa_url, perfil_id, downloads_count')
    .order('downloads_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[api/cds/top-downloads]', error.message)
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

  const items: TopDownloadItem[] = (rows ?? []).map(
    (row: { id: string; titulo: string | null; capa_url: string | null; perfil_id: string; downloads_count: number }) => ({
      id: row.id,
      titulo: row.titulo ?? '',
      capa_url: row.capa_url ?? null,
      artista: names[row.perfil_id] ?? 'Artista',
      downloads_count: row.downloads_count ?? 0,
    })
  )

  return { items }
})
