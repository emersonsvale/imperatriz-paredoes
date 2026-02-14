/**
 * Remove uma faixa. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const cdId = getRouterParam(event, 'id')
  const faixaId = getRouterParam(event, 'faixaId')
  if (!cdId || !faixaId) throw createError({ statusCode: 400, statusMessage: 'ID do CD e da faixa obrigatórios' })

  const { client } = await requireAdmin(event)
  const { error } = await client
    .from('faixa')
    .delete()
    .eq('id', faixaId)
    .eq('cd_id', cdId)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})
