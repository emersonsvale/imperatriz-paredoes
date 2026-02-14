/**
 * Composable para CRUD de parceiros no painel admin.
 */
import type { Tables, TablesInsert, TablesUpdate } from '~~/shared/types/database.types'

export type ParceiroRow = Tables<'parceiro'>

export function useAdminParceiros() {
  const { adminFetch } = useAdminApi()
  const items = ref<ParceiroRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchParceiros() {
    loading.value = true
    error.value = null
    try {
      const { items: data } = await adminFetch<{ items: ParceiroRow[] }>('/api/admin/parceiros')
      items.value = data ?? []
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'data' in e && e.data && typeof (e.data as { message?: string }).message === 'string'
        ? (e.data as { message: string }).message
        : 'Erro ao carregar parceiros'
      error.value = msg
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function createParceiro(payload: Omit<TablesInsert<'parceiro'>, 'id' | 'created_at'>) {
    const created = await adminFetch<ParceiroRow>('/api/admin/parceiros', {
      method: 'POST',
      body: payload,
    })
    await fetchParceiros()
    return created
  }

  async function updateParceiro(id: string, payload: TablesUpdate<'parceiro'>) {
    await adminFetch(`/api/admin/parceiros/${id}`, { method: 'PUT', body: payload })
    await fetchParceiros()
  }

  async function deleteParceiro(id: string) {
    await adminFetch(`/api/admin/parceiros/${id}`, { method: 'DELETE' })
    await fetchParceiros()
  }

  return { items, loading, error, fetchParceiros, createParceiro, updateParceiro, deleteParceiro }
}
