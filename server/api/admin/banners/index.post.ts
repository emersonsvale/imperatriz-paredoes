/**
 * Cria um banner. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ image_url: string; image_alt?: string | null; link?: string | null; ordem?: number }>(event)
  if (!body?.image_url?.trim()) throw createError({ statusCode: 400, statusMessage: 'image_url é obrigatório' })

  const { client } = await requireAdmin(event)
  const { data, error } = await client
    .from('banner')
    .insert({
      image_url: body.image_url.trim(),
      image_alt: body.image_alt ?? null,
      link: body.link ?? null,
      ordem: body.ordem ?? 0,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
