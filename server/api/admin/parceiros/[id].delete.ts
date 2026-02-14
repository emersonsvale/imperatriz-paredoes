/**
 * Remove um parceiro. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const { client } = await requireAdmin(event)
  const { error } = await client.from('parceiro').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})
