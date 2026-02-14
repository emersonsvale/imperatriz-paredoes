/**
 * Atualiza uma faixa. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const cdId = getRouterParam(event, 'id')
  const faixaId = getRouterParam(event, 'faixaId')
  if (!cdId || !faixaId) throw createError({ statusCode: 400, statusMessage: 'ID do CD e da faixa obrigatórios' })

  const body = await readBody<{
    titulo?: string
    artista?: string | null
    duracao?: string | null
    ordem?: number
    arquivo_url?: string | null
  }>(event)
  const { client } = await requireAdmin(event)

  const payload: Record<string, unknown> = {}
  if (body?.titulo !== undefined) payload.titulo = body.titulo
  if (body?.artista !== undefined) payload.artista = body.artista
  if (body?.duracao !== undefined) payload.duracao = body.duracao
  if (body?.ordem !== undefined) payload.ordem = body.ordem
  if (body?.arquivo_url !== undefined) payload.arquivo_url = body.arquivo_url

  const { data, error } = await client
    .from('faixa')
    .update(payload)
    .eq('id', faixaId)
    .eq('cd_id', cdId)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
