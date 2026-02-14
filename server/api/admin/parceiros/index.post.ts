/**
 * Cria um parceiro. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ nome: string; logo_url?: string | null; href?: string | null; ordem?: number }>(event)
  if (!body?.nome?.trim()) throw createError({ statusCode: 400, statusMessage: 'nome é obrigatório' })

  const { client } = await requireAdmin(event)
  const { data, error } = await client
    .from('parceiro')
    .insert({
      nome: body.nome.trim(),
      logo_url: body.logo_url ?? null,
      href: body.href ?? null,
      ordem: body.ordem ?? 0,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
