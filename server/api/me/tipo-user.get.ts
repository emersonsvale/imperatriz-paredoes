/**
 * Retorna o tipo_user do perfil do usuário autenticado (cookie).
 * Usado pelo middleware artistGuard para verificar acesso às rotas /artist/*.
 */
import { serverSupabaseUser } from '#supabase/server'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user?.id) {
    return { tipo_user: null }
  }
  const client = await serverSupabaseClient(event)
  const { data: perfil } = await client
    .from('perfil')
    .select('tipo_user')
    .eq('id', user.id)
    .single()
  return { tipo_user: perfil?.tipo_user ?? null }
})
