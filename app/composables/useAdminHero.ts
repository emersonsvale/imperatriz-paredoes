/**
 * Composable para gerenciar itens do hero (banners, CDs, DJs) no painel admin.
 */
export interface HeroSlideItem {
  id: string
  type: 'banner' | 'cd' | 'dj'
  reference_id: string
  ordem: number
  label: string
}

export function useAdminHero() {
  const { adminFetch } = useAdminApi()
  const items = ref<HeroSlideItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    loading.value = true
    error.value = null
    try {
      const { items: data } = await adminFetch<{ items: HeroSlideItem[] }>('/api/admin/hero')
      items.value = data ?? []
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'data' in e && e.data && typeof (e.data as { message?: string }).message === 'string'
        ? (e.data as { message: string }).message
        : 'Erro ao carregar itens do hero'
      error.value = msg
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function addItem(type: 'banner' | 'cd' | 'dj', referenceId: string) {
    await adminFetch('/api/admin/hero', {
      method: 'POST',
      body: { type, reference_id: referenceId },
    })
    await fetchItems()
  }

  async function removeItem(id: string) {
    await adminFetch(`/api/admin/hero/${id}`, { method: 'DELETE' })
    await fetchItems()
  }

  async function reorder(order: string[]) {
    await adminFetch('/api/admin/hero/reorder', { method: 'PUT', body: { order } })
    await fetchItems()
  }

  return { items, loading, error, fetchItems, addItem, removeItem, reorder }
}
