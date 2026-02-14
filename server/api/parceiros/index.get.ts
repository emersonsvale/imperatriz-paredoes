/**
 * Lista parceiros para a seção "Nossos Parceiros" na home. Público, sem autenticação.
 */
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('parceiro')
    .select('id, nome, logo_url, href')
    .order('ordem', { ascending: true })

  if (error) return []
  return (data ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    logoUrl: p.logo_url ?? null,
    href: p.href ?? null,
  }))
})
