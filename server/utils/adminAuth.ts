/**
 * Garante que o request é de um usuário com perfil tipo_user = 'Admin'.
 * Retorna o client Supabase do usuário (autenticado). RLS permite Admin gerenciar tudo (cd, faixa, etc.).
 * Não usa service role, evitando necessidade de SUPABASE_SECRET_KEY e erro "Invalid API key".
 */
import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { getAuthUser } from '~~/server/utils/auth'

export async function requireAdmin(event: H3Event) {
  const auth = await getAuthUser(event)
  if (!auth?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }

  const client = await serverSupabaseClient(event)
  const { data: perfil } = await client
    .from('perfil')
    .select('tipo_user')
    .eq('id', auth.user.id)
    .single()

  if (perfil?.tipo_user !== 'Admin') {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito a administradores' })
  }

  return { user: auth.user, client }
}
