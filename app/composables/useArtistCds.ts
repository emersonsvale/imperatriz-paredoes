/**
 * Composable para listar e criar CDs do artista (perfil DJ).
 * No cliente usa getSession() como fallback para carregar CDs mesmo com useSupabaseUser atrasado.
 */
import type { Tables, TablesInsert } from '~~/shared/types/database.types'
import type { CdCardData } from '~~/shared/types/Cd'

export type CdRow = Tables<'cd'>
export type FaixaRow = Tables<'faixa'>
export type CdInsert = TablesInsert<'cd'>
export type FaixaInsert = TablesInsert<'faixa'>

export function useArtistCds() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const cds = ref<CdRow[]>([])
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

  async function fetchCds() {
    const userId = await resolveUserId()
    if (!userId) {
      cds.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('cd')
        .select('*')
        .eq('perfil_id', userId)
        .order('created_at', { ascending: false })
      if (err) {
        error.value = err.message
        cds.value = []
        return
      }
      cds.value = (data ?? []) as CdRow[]
    } finally {
      loading.value = false
    }
  }

  /** Converte CD do banco + nome do artista para CdCardData */
  function toCdCardData(cd: CdRow, artistName: string): CdCardData {
    return {
      id: cd.id,
      title: cd.titulo,
      artist: artistName,
      coverUrl: cd.capa_url ?? '',
      downloadSize: undefined,
    }
  }

  watch(
    user,
    (u) => {
      if (u?.id) fetchCds()
      else if (import.meta.client) fetchCds()
      else cds.value = []
    },
    { immediate: true }
  )

  return {
    cds: readonly(cds),
    loading: readonly(loading),
    error: readonly(error),
    fetchCds,
    toCdCardData,
  }
}
