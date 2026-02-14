/**
 * Detalhe de um CD público por id (para a página /cd/[id]).
 */
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return null

  const supabase = await serverSupabaseClient(event)

  const { data: cdRow, error: cdError } = await supabase
    .from('cd')
    .select('id, titulo, descricao, capa_url, created_at, perfil_id, downloads_count, plays_count')
    .eq('id', id)
    .single()

  if (cdError || !cdRow) {
    return null
  }

  const [{ data: perfilRow }, { data: faixasRows }] = await Promise.all([
    supabase.from('perfil').select('id, nome, foto_perfil, bio, instagram, facebook, twitter, whatsapp').eq('id', cdRow.perfil_id).single(),
    supabase.from('faixa').select('id, titulo, artista, duracao, ordem, arquivo_url, downloads_count, plays_count').eq('cd_id', id).order('ordem', { ascending: true }),
  ])

  type PerfilRow = { id?: string; nome: string | null; foto_perfil: string | null; bio: string | null; instagram?: string | null; facebook?: string | null; twitter?: string | null; whatsapp?: string | null }
  const pr = perfilRow as PerfilRow | null
  const perfilId = pr?.id ?? cdRow.perfil_id
  const nome = pr?.nome ?? 'Artista'
  const foto = pr?.foto_perfil ?? ''
  const bio = pr?.bio ?? ''
  const instagram = pr?.instagram ?? undefined
  const facebook = pr?.facebook ?? undefined
  const twitter = pr?.twitter ?? undefined
  const whatsapp = pr?.whatsapp ?? undefined

  const releaseDate = formatReleaseDate(cdRow.created_at)
  const trackCount = (faixasRows ?? []).length
  const totalDuration = '—' // opcional: somar duracao das faixas se preenchido no futuro

  const cd = cdRow as { downloads_count?: number; plays_count?: number }
  return {
    album: {
      title: cdRow.titulo ?? '',
      subtitle: cdRow.descricao ?? '',
      coverUrl: cdRow.capa_url ?? '',
      tags: [],
      releaseDate,
      trackCount,
      totalDuration,
      downloadsCount: cd.downloads_count ?? 0,
      playsCount: cd.plays_count ?? 0,
    },
    dj: {
      id: perfilId,
      name: nome,
      avatarUrl: foto,
      bio,
      instagram,
      facebook,
      twitter,
      whatsapp,
    },
    tracks: (faixasRows ?? []).map((f: { id: string; titulo: string | null; artista: string | null; duracao: string | null; arquivo_url: string | null; downloads_count?: number; plays_count?: number }) => ({
      id: f.id,
      title: f.titulo ?? 'Faixa',
      artist: f.artista ?? nome,
      duration: f.duracao ?? '—',
      isActive: false,
      audioUrl: f.arquivo_url ?? undefined,
      downloadsCount: f.downloads_count ?? 0,
      playsCount: f.plays_count ?? 0,
    })),
  }
})

function formatReleaseDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}
