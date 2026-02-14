/**
 * Composable para listar e gerenciar CDs/faixas no painel admin.
 */
import type { Tables } from '~~/shared/types/database.types'

export type CdRow = Tables<'cd'>
export type FaixaRow = Tables<'faixa'>

export interface CdAdminListItem extends CdRow {
  artista_nome: string
}

export function useAdminCds() {
  const { adminFetch } = useAdminApi()
  const items = ref<CdAdminListItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCds() {
    loading.value = true
    error.value = null
    try {
      const { items: data } = await adminFetch<{ items: CdAdminListItem[] }>('/api/admin/cds')
      items.value = data ?? []
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'data' in e && e.data && typeof (e.data as { message?: string }).message === 'string'
        ? (e.data as { message: string }).message
        : 'Erro ao carregar CDs'
      error.value = msg
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function createCd(payload: { perfil_id: string; titulo: string; genero?: string | null; descricao?: string | null; capa_url?: string | null }) {
    const created = await adminFetch<CdRow>('/api/admin/cds', { method: 'POST', body: payload })
    await fetchCds()
    return created
  }

  async function updateCd(id: string, payload: Partial<Pick<CdRow, 'titulo' | 'genero' | 'descricao' | 'capa_url' | 'perfil_id'>>) {
    await adminFetch(`/api/admin/cds/${id}`, { method: 'PUT', body: payload })
    await fetchCds()
  }

  async function deleteCd(id: string) {
    await adminFetch(`/api/admin/cds/${id}`, { method: 'DELETE' })
    await fetchCds()
  }

  return { items, loading, error, fetchCds, createCd, updateCd, deleteCd }
}
