/**
 * Composable para acesso ao perfil do usuário (tabela public.perfil).
 * No cliente usa getSession() como fallback para garantir que o perfil carregue mesmo
 * quando useSupabaseUser() ainda não estiver hidratado (ex.: páginas do artista).
 */
import type { Tables, TablesUpdate } from '~~/shared/types/database.types'

export type Perfil = Tables<'perfil'>
export type PerfilUpdate = TablesUpdate<'perfil'>

export function usePerfil() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const perfil = ref<Perfil | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function resolveUserId(): Promise<string | null> {
    if (user.value?.id) return user.value.id
    if (import.meta.client) {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.user?.id ?? null
    }
    return null
  }

  async function fetchPerfil() {
    const userId = await resolveUserId()
    if (!userId) {
      perfil.value = null
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('perfil')
        .select('*')
        .eq('id', userId)
        .single()
      if (err) {
        error.value = err.message
        perfil.value = null
        return
      }
      perfil.value = data as Perfil
    } finally {
      loading.value = false
    }
  }

  async function updatePerfil(payload: PerfilUpdate) {
    const userId = await resolveUserId()
    if (!userId) return { success: false, error: 'Não autenticado' }
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('perfil')
        .update(payload)
        .eq('id', userId)
      if (err) {
        error.value = err.message
        return { success: false, error: err }
      }
      await fetchPerfil()
      return { success: true }
    } finally {
      loading.value = false
    }
  }

  watch(
    user,
    (u) => {
      if (u?.id) fetchPerfil()
      else if (import.meta.client) fetchPerfil()
      else perfil.value = null
    },
    { immediate: true }
  )

  return {
    perfil: readonly(perfil),
    loading: readonly(loading),
    error: readonly(error),
    fetchPerfil,
    updatePerfil,
    getUserId: resolveUserId,
  }
}
