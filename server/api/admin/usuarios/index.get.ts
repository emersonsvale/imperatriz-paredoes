/**
 * Lista todos os perfis (usuários). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const { data, error } = await client
    .from('perfil')
    .select('id, created_at, nome, email, telefone, tipo_user, foto_perfil, bio, instagram, facebook, twitter, whatsapp')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return { items: data ?? [] }
})
