/**
 * Lista todos os CDs com nome do perfil. Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const { data: cds, error: cdError } = await client
    .from('cd')
    .select('id, created_at, perfil_id, titulo, genero, descricao, capa_url, downloads_count, plays_count')
    .order('created_at', { ascending: false })

  if (cdError) throw createError({ statusCode: 500, statusMessage: cdError.message })
  const list = cds ?? []

  const perfilIds = [...new Set(list.map((c) => c.perfil_id))]
  const { data: perfis } = await client
    .from('perfil')
    .select('id, nome')
    .in('id', perfilIds)

  const nomeByPerfilId: Record<string, string> = {}
  for (const p of perfis ?? []) {
    nomeByPerfilId[p.id] = p.nome ?? '—'
  }

  const items = list.map((cd) => ({
    ...cd,
    artista_nome: nomeByPerfilId[cd.perfil_id] ?? '—',
  }))
  return { items }
})
