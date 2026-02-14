/**
 * Cliente Supabase para leitura pública (APIs de listagem da home).
 * Usa SUPABASE_URL + SUPABASE_KEY (anon) para não depender do contexto do request no SSR.
 */
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let publicClient: SupabaseClient | null = null

export function getSupabasePublic(): SupabaseClient {
  if (publicClient) return publicClient
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL e SUPABASE_KEY são obrigatórios para leitura pública')
  }
  publicClient = createClient(url, key)
  return publicClient
}
