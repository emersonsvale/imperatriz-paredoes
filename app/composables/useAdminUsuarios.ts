/**
 * Composable para listar e atualizar usuários (perfis) no painel admin.
 */
import type { Tables, TablesUpdate } from '~~/shared/types/database.types'

export type PerfilAdmin = Tables<'perfil'>

export function useAdminUsuarios() {
  const { adminFetch } = useAdminApi()
  const items = ref<PerfilAdmin[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsuarios() {
    loading.value = true
    error.value = null
    try {
      const { items: data } = await adminFetch<{ items: PerfilAdmin[] }>('/api/admin/usuarios')
      items.value = data ?? []
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'data' in e && e.data && typeof (e.data as { message?: string }).message === 'string'
        ? (e.data as { message: string }).message
        : 'Erro ao carregar usuários'
      error.value = msg
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function updateUsuario(id: string, payload: TablesUpdate<'perfil'>) {
    await adminFetch(`/api/admin/usuarios/${id}`, {
      method: 'PUT',
      body: payload,
    })
    await fetchUsuarios()
  }

  return { items, loading, error, fetchUsuarios, updateUsuario }
}
