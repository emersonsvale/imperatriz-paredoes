/**
 * Atualiza um CD. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const body = await readBody<{
    titulo?: string
    genero?: string | null
    descricao?: string | null
    capa_url?: string | null
    perfil_id?: string
  }>(event)
  const { client } = await requireAdmin(event)

  const payload: Record<string, unknown> = {}
  if (body?.titulo !== undefined) payload.titulo = body.titulo
  if (body?.genero !== undefined) payload.genero = body.genero
  if (body?.descricao !== undefined) payload.descricao = body.descricao
  if (body?.capa_url !== undefined) payload.capa_url = body.capa_url
  if (body?.perfil_id !== undefined) payload.perfil_id = body.perfil_id

  const { data, error } = await client
    .from('cd')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
