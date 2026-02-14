/**
 * Retorna um $fetch que envia o token da sessão Supabase no header Authorization.
 * Garante que as APIs /api/admin/* recebam autenticação mesmo quando os cookies não vêm (ex.: SSR ou contexto do cliente).
 */
export function useAdminApi() {
  const supabase = useSupabaseClient()

  async function getAuthHeaders(): Promise<Record<string, string>> {
    if (import.meta.server) return {}
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  }

  async function adminFetch<T>(url: string, options?: Parameters<typeof $fetch<T>>[1]) {
    const authHeaders = await getAuthHeaders()
    return $fetch<T>(url, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options?.headers as Record<string, string> | undefined),
      },
    })
  }

  return { adminFetch }
}
