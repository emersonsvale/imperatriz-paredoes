/**
 * Composable para CRUD de banners no painel admin.
 */
import type { Tables, TablesInsert, TablesUpdate } from '~~/shared/types/database.types'

export type BannerRow = Tables<'banner'>

export function useAdminBanners() {
  const { adminFetch } = useAdminApi()
  const items = ref<BannerRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBanners() {
    loading.value = true
    error.value = null
    try {
      const { items: data } = await adminFetch<{ items: BannerRow[] }>('/api/admin/banners')
      items.value = data ?? []
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'data' in e && e.data && typeof (e.data as { message?: string }).message === 'string'
        ? (e.data as { message: string }).message
        : 'Erro ao carregar banners'
      error.value = msg
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function createBanner(payload: Omit<TablesInsert<'banner'>, 'id' | 'created_at'>) {
    const created = await adminFetch<BannerRow>('/api/admin/banners', {
      method: 'POST',
      body: payload,
    })
    await fetchBanners()
    return created
  }

  async function updateBanner(id: string, payload: TablesUpdate<'banner'>) {
    await adminFetch(`/api/admin/banners/${id}`, { method: 'PUT', body: payload })
    await fetchBanners()
  }

  async function deleteBanner(id: string) {
    await adminFetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    await fetchBanners()
  }

  return { items, loading, error, fetchBanners, createBanner, updateBanner, deleteBanner }
}
