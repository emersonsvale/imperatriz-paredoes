/**
 * Obtém o usuário autenticado no servidor: primeiro pelo cookie (serverSupabaseUser),
 * depois pelo header Authorization Bearer (útil quando o cliente chama a API com $fetch e o cookie não vem).
 * Retorna também o accessToken quando obtido do header, para usar em clientes Supabase com contexto do usuário.
 */
import type { User } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export type AuthResult = { user: User; accessToken?: string } | null

export async function getAuthUser(event: H3Event): Promise<AuthResult> {
  const fromCookie = await serverSupabaseUser(event)
  if (fromCookie?.id) return { user: fromCookie }

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  if (!token) return null

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return { user, accessToken: token }
}
