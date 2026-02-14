/**
 * Detalhe de um CD com faixas (admin). Apenas Admin.
 */
import { requireAdmin } from '~~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID obrigatório' })

  const { client } = await requireAdmin(event)
  const [{ data: cd, error: cdError }, { data: faixas, error: faixaError }] = await Promise.all([
    client.from('cd').select('*').eq('id', id).single(),
    client.from('faixa').select('*').eq('cd_id', id).order('ordem', { ascending: true }),
  ])

  let artistaNome = '—'
  if (cd?.perfil_id) {
    const { data: perfilRow } = await client.from('perfil').select('nome').eq('id', cd.perfil_id).single()
    artistaNome = (perfilRow as { nome?: string } | null)?.nome ?? '—'
  }

  if (cdError || !cd) throw createError({ statusCode: 404, statusMessage: 'CD não encontrado' })
  if (faixaError) throw createError({ statusCode: 500, statusMessage: faixaError.message })

  return {
    cd,
    faixas: faixas ?? [],
    artista_nome: artistaNome,
  }
})
