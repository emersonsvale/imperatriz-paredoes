/**
 * Atualiza um perfil por id. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const body = await readBody<{
    nome?: string | null
    email?: string | null
    telefone?: string | null
    tipo_user?: 'Admin' | 'DJ' | 'Ouvinte' | null
    foto_perfil?: string | null
    bio?: string | null
    instagram?: string | null
    facebook?: string | null
    twitter?: string | null
    whatsapp?: string | null
  }>(event)

  const { client } = await requireAdmin(event)
  const payload: Record<string, unknown> = {}
  if (body?.nome !== undefined) payload.nome = body.nome
  if (body?.email !== undefined) payload.email = body.email
  if (body?.telefone !== undefined) payload.telefone = body.telefone
  if (body?.tipo_user !== undefined) payload.tipo_user = body.tipo_user
  if (body?.foto_perfil !== undefined) payload.foto_perfil = body.foto_perfil
  if (body?.bio !== undefined) payload.bio = body.bio
  if (body?.instagram !== undefined) payload.instagram = body.instagram
  if (body?.facebook !== undefined) payload.facebook = body.facebook
  if (body?.twitter !== undefined) payload.twitter = body.twitter
  if (body?.whatsapp !== undefined) payload.whatsapp = body.whatsapp

  const { data, error } = await client
    .from('perfil')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
