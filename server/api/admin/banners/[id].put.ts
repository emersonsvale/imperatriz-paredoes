/**
 * Atualiza um banner. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const body = await readBody<{ image_url?: string; image_alt?: string | null; link?: string | null; ordem?: number }>(event)
  const { client } = await requireAdmin(event)

  const payload: Record<string, unknown> = {}
  if (body?.image_url !== undefined) payload.image_url = body.image_url
  if (body?.image_alt !== undefined) payload.image_alt = body.image_alt
  if (body?.link !== undefined) payload.link = body.link
  if (body?.ordem !== undefined) payload.ordem = body.ordem

  const { data, error } = await client
    .from('banner')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
