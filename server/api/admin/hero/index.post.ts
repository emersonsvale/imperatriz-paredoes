/**
 * Adiciona item ao hero (banner, cd ou dj). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ type: 'banner' | 'cd' | 'dj'; reference_id: string }>(event)
  if (!body?.type || !body?.reference_id) {
    throw createError({ statusCode: 400, statusMessage: 'type e reference_id são obrigatórios' })
  }
  const validTypes = ['banner', 'cd', 'dj'] as const
  if (!validTypes.includes(body.type)) {
    throw createError({ statusCode: 400, statusMessage: 'type deve ser banner, cd ou dj' })
  }

  const { client } = await requireAdmin(event)
  const { data: max } = await client.from('hero_slide').select('ordem').order('ordem', { ascending: false }).limit(1).single()
  const nextOrdem = ((max as { ordem?: number } | null)?.ordem ?? -1) + 1

  const { data, error } = await client
    .from('hero_slide')
    .insert({ type: body.type, reference_id: body.reference_id, ordem: nextOrdem })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
