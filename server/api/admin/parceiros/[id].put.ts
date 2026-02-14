/**
 * Atualiza um parceiro. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const body = await readBody<{ nome?: string; logo_url?: string | null; href?: string | null; ordem?: number }>(event)
  const { client } = await requireAdmin(event)

  const payload: Record<string, unknown> = {}
  if (body?.nome !== undefined) payload.nome = body.nome
  if (body?.logo_url !== undefined) payload.logo_url = body.logo_url
  if (body?.href !== undefined) payload.href = body.href
  if (body?.ordem !== undefined) payload.ordem = body.ordem

  const { data, error } = await client
    .from('parceiro')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
