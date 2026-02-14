/**
 * Cria um CD (vinculado a um perfil/DJ). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    perfil_id: string
    titulo: string
    genero?: string | null
    descricao?: string | null
    capa_url?: string | null
  }>(event)
  if (!body?.perfil_id || !body?.titulo?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'perfil_id e titulo são obrigatórios' })
  }

  const { client } = await requireAdmin(event)
  const { data, error } = await client
    .from('cd')
    .insert({
      perfil_id: body.perfil_id,
      titulo: body.titulo.trim(),
      genero: body.genero ?? null,
      descricao: body.descricao ?? null,
      capa_url: body.capa_url ?? null,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
