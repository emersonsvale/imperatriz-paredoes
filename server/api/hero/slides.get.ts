/**
 * Retorna os slides do hero da home (banners, CDs e DJs selecionados pelo admin).
 * Público, sem autenticação.
 */
import type { HeroSlide } from '~~/shared/types/HeroSlide'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<HeroSlide[]> => {
  const supabase = await serverSupabaseClient(event)
  const { data: rows, error } = await supabase
    .from('hero_slide')
    .select('id, type, reference_id, ordem')
    .order('ordem', { ascending: true })

  if (error || !rows?.length) return []

  const slides: HeroSlide[] = []
  for (const row of rows) {
    if (row.type === 'banner') {
      const { data: b } = await supabase.from('banner').select('image_url, image_alt, link').eq('id', row.reference_id).single()
      if (b?.image_url) {
        slides.push({
          type: 'banner',
          imageUrl: b.image_url,
          imageAlt: b.image_alt ?? undefined,
          link: b.link ?? undefined,
        })
      }
    } else if (row.type === 'cd') {
      const { data: cd } = await supabase
        .from('cd')
        .select('id, titulo, capa_url, perfil_id, created_at, plays_count, downloads_count')
        .eq('id', row.reference_id)
        .single()
      if (cd) {
        const cdRow = cd as {
          id: string
          titulo: string
          capa_url: string | null
          perfil_id: string
          created_at: string
          plays_count: number
          downloads_count: number
        }
        const { data: perfil } = await supabase.from('perfil').select('nome').eq('id', cdRow.perfil_id).single()
        const artista = (perfil as { nome?: string } | null)?.nome ?? 'Artista'
        const { count: tracksCount } = await supabase
          .from('faixa')
          .select('*', { count: 'exact', head: true })
          .eq('cd_id', cdRow.id)
        const created = new Date(cdRow.created_at)
        const dateStr = created.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        const oneDayMs = 24 * 60 * 60 * 1000
        const isNew = Date.now() - created.getTime() < 7 * oneDayMs
        slides.push({
          type: 'cd',
          id: cdRow.id,
          title: cdRow.titulo ?? 'CD',
          artist: artista,
          coverUrl: cdRow.capa_url ?? '',
          date: dateStr,
          tracksCount: tracksCount ?? 0,
          playsCount: cdRow.plays_count ?? 0,
          downloadsCount: cdRow.downloads_count ?? 0,
          isNew,
          listenUrl: `/cd/${cdRow.id}`,
          downloadUrl: `/cd/${cdRow.id}`,
        })
      }
    } else if (row.type === 'dj') {
      const { data: perfil } = await supabase.from('perfil').select('id, nome, foto_perfil, bio').eq('id', row.reference_id).single()
      if (perfil) {
        const p = perfil as { id: string; nome: string | null; foto_perfil: string | null; bio: string | null }
        let imageUrl = p.foto_perfil ?? ''
        if (!imageUrl) {
          const { data: firstCd } = await supabase.from('cd').select('capa_url').eq('perfil_id', p.id).order('created_at', { ascending: false }).limit(1).single()
          imageUrl = (firstCd as { capa_url?: string } | null)?.capa_url ?? ''
        }
        if (!imageUrl) imageUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="%23333" width="400" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="18">DJ</text></svg>')
        slides.push({
          type: 'content',
          tag: 'DJ',
          title: p.nome ?? 'DJ',
          titleHighlight: p.nome ?? 'DJ',
          titleSuffix: '',
          description: (p.bio ?? '').slice(0, 160),
          imageUrl,
          imageAlt: p.nome ?? undefined,
          listenUrl: `/dj/${p.id}`,
        })
      }
    }
  }
  return slides
})
