/**
 * Perfil público de um DJ por id (para a página /dj/[id]).
 * Retorna dados do perfil e lista de CDs do DJ.
 */
import { getSupabasePublic } from '~~/server/utils/supabasePublic'

export interface DjPublicProfile {
  id: string
  nome: string
  foto_perfil: string | null
  bio: string | null
  instagram: string | null
  facebook: string | null
  twitter: string | null
  whatsapp: string | null
  cdCount: number
  playsCount: number
  downloadsCount: number
  cds: Array<{
    id: string
    titulo: string
    capa_url: string | null
    created_at: string
    downloads_count: number
    plays_count: number
  }>
}

export default defineEventHandler(async (event): Promise<DjPublicProfile | null> => {
  const id = getRouterParam(event, 'id')
  if (!id) return null

  let supabase
  try {
    supabase = getSupabasePublic()
  } catch (e) {
    console.error('[api/djs/[id]]', e)
    return null
  }

  const { data: perfil, error: perfilError } = await supabase
    .from('perfil')
    .select('id, nome, foto_perfil, bio, instagram, facebook, twitter, whatsapp')
    .eq('id', id)
    .single()

  if (perfilError || !perfil) {
    return null
  }

  const { data: cdRows, error: cdError } = await supabase
    .from('cd')
    .select('id, titulo, capa_url, created_at, downloads_count, plays_count')
    .eq('perfil_id', id)
    .order('created_at', { ascending: false })

  if (cdError) {
    console.error('[api/djs/[id]] cds', cdError.message)
    return {
      id: perfil.id,
      nome: perfil.nome ?? 'Artista',
      foto_perfil: perfil.foto_perfil ?? null,
      bio: perfil.bio ?? null,
      instagram: perfil.instagram ?? null,
      facebook: perfil.facebook ?? null,
      twitter: perfil.twitter ?? null,
      whatsapp: perfil.whatsapp ?? null,
      cdCount: 0,
      playsCount: 0,
      downloadsCount: 0,
      cds: [],
    }
  }

  const cds = (cdRows ?? []).map((row: { id: string; titulo: string | null; capa_url: string | null; created_at: string; downloads_count?: number; plays_count?: number }) => ({
    id: row.id,
    titulo: row.titulo ?? '',
    capa_url: row.capa_url ?? null,
    created_at: row.created_at,
    downloads_count: row.downloads_count ?? 0,
    plays_count: row.plays_count ?? 0,
  }))

  const playsCount = (cdRows ?? []).reduce((acc: number, r: { plays_count?: number }) => acc + (r.plays_count ?? 0), 0)
  const downloadsCount = (cdRows ?? []).reduce((acc: number, r: { downloads_count?: number }) => acc + (r.downloads_count ?? 0), 0)

  return {
    id: perfil.id,
    nome: perfil.nome ?? 'Artista',
    foto_perfil: perfil.foto_perfil ?? null,
    bio: perfil.bio ?? null,
    instagram: perfil.instagram ?? null,
    facebook: perfil.facebook ?? null,
    twitter: perfil.twitter ?? null,
    whatsapp: perfil.whatsapp ?? null,
    cdCount: cds.length,
    playsCount,
    downloadsCount,
    cds,
  }
})
