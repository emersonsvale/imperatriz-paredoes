/**
 * Lista itens do hero com dados resolvidos (título/nome para exibição). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const { data: rows, error } = await client
    .from('hero_slide')
    .select('id, type, reference_id, ordem')
    .order('ordem', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  const items = (rows ?? []).map((r) => ({ ...r, label: '' }))

  for (const item of items) {
    if (item.type === 'banner') {
      const { data: b } = await client.from('banner').select('image_alt').eq('id', item.reference_id).single()
      item.label = (b as { image_alt?: string } | null)?.image_alt ?? 'Banner'
    } else if (item.type === 'cd') {
      const { data: cd } = await client.from('cd').select('titulo').eq('id', item.reference_id).single()
      item.label = (cd as { titulo?: string } | null)?.titulo ?? 'CD'
    } else if (item.type === 'dj') {
      const { data: p } = await client.from('perfil').select('nome').eq('id', item.reference_id).single()
      item.label = (p as { nome?: string } | null)?.nome ?? 'DJ'
    }
  }
  return { items }
})
