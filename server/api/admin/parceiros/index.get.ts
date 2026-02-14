/**
 * Lista todos os parceiros. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const { data, error } = await client
    .from('parceiro')
    .select('*')
    .order('ordem', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { items: data ?? [] }
})
