/**
 * Cria uma faixa em um CD. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const cdId = getRouterParam(event, 'id')
  if (!cdId) throw createError({ statusCode: 400, statusMessage: 'ID do CD obrigatório' })

  const body = await readBody<{
    titulo: string
    artista?: string | null
    duracao?: string | null
    ordem?: number
    arquivo_url?: string | null
  }>(event)
  if (!body?.titulo?.trim()) throw createError({ statusCode: 400, statusMessage: 'titulo é obrigatório' })

  const { client } = await requireAdmin(event)
  const { data, error } = await client
    .from('faixa')
    .insert({
      cd_id: cdId,
      titulo: body.titulo.trim(),
      artista: body.artista ?? null,
      duracao: body.duracao ?? null,
      ordem: body.ordem ?? 0,
      arquivo_url: body.arquivo_url ?? null,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
