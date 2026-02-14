/**
 * Remove um CD (e em cascata as faixas, se configurado no banco). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const { client } = await requireAdmin(event)
  const { error: faixaErr } = await client.from('faixa').delete().eq('cd_id', id)
  if (faixaErr) throw createError({ statusCode: 500, statusMessage: faixaErr.message })
  const { error } = await client.from('cd').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})
