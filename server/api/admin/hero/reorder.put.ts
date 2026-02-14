/**
 * Reordena itens do hero. Body: { order: string[] } (array de ids na nova ordem). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ order: string[] }>(event)
  if (!Array.isArray(body?.order) || body.order.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'order deve ser um array de ids' })
  }
  const { client } = await requireAdmin(event)
  for (let i = 0; i < body.order.length; i++) {
    const { error } = await client.from('hero_slide').update({ ordem: i }).eq('id', body.order[i])
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return { success: true }
})
