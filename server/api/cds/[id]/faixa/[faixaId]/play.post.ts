/**
 * Registra uma reprodução da faixa (incrementa plays_count na faixa e no CD).
 * Chamado pelo player quando o usuário inicia a reprodução.
 */
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const faixaId = getRouterParam(event, 'faixaId')
  if (!id || !faixaId) {
    throw createError({ statusCode: 400, statusMessage: 'ID do CD e da faixa são obrigatórios' })
  }

  const supabase = await serverSupabaseClient(event)

  const { error } = await supabase.rpc('increment_faixa_plays', {
    p_faixa_id: faixaId,
    p_cd_id: id,
  })

  if (error) {
    console.warn('[play post]', error.message)
    throw createError({ statusCode: 502, statusMessage: 'Falha ao registrar reprodução' })
  }

  return { ok: true }
})
