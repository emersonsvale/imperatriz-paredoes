/**
 * Publicar novo CD: capa no Supabase Storage, faixas no MinIO (via proxy), metadados no Supabase.
 * Capa: bucket capas | Faixas: MinIO bucket audios/{userId}/{cdId}/{ordem}_nome.ext
 */
import type { TablesInsert } from '~~/shared/types/database.types'

export type PublishCdPayload = {
  titulo: string
  descricao: string
  coverFile: File | null
  trackFiles: File[]
}

function fileToBase64(file: File): Promise<string> {
  return file.arrayBuffer().then((arrayBuffer) => {
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    const chunk = 8192
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
  })
}

function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = useSupabaseClient()
  return supabase.auth.getSession().then(({ data: { session } }) => {
    const headers: Record<string, string> = {}
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }
    return headers
  })
}

export function usePublishCd() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const progress = ref(0)
  const progressLabel = ref('')
  const error = ref<string | null>(null)

  async function publish(payload: PublishCdPayload): Promise<{ success: boolean; cdId?: string }> {
    let userId = user.value?.id
    if (!userId && import.meta.client) {
      const { data: { session } } = await supabase.auth.getSession()
      userId = session?.user?.id ?? undefined
    }
    if (!userId) {
      error.value = 'Não autenticado'
      return { success: false }
    }
    if (!payload.titulo?.trim()) {
      error.value = 'Título do CD é obrigatório'
      return { success: false }
    }

    loading.value = true
    error.value = null
    progress.value = 0
    progressLabel.value = 'Criando álbum...'

    try {
      // 1) Insert CD sem capa para obter cdId
      const { data: cdRow, error: insertCdErr } = await supabase
        .from('cd')
        .insert({
          perfil_id: userId,
          titulo: payload.titulo.trim(),
          genero: payload.genero?.trim() || null,
          descricao: payload.descricao?.trim() || null,
        } satisfies TablesInsert<'cd'>)
        .select('id')
        .single()

      if (insertCdErr || !cdRow) {
        error.value = insertCdErr?.message ?? 'Erro ao criar CD'
        return { success: false }
      }

      const cdId = cdRow.id

      // 2) Upload capa no Supabase Storage (bucket capas)
      if (payload.coverFile) {
        progressLabel.value = 'Enviando capa...'
        const ext = payload.coverFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${userId}/${cdId}_capa.${ext}`
        const { error: uploadCoverErr } = await supabase.storage
          .from('capas')
          .upload(path, payload.coverFile, { upsert: true })
        if (uploadCoverErr) {
          error.value = `Capa: ${uploadCoverErr.message}`
          return { success: false }
        }
        const { data: urlData } = supabase.storage.from('capas').getPublicUrl(path)
        await supabase.from('cd').update({ capa_url: urlData.publicUrl }).eq('id', cdId)
      }

      progress.value = 20

      const authHeaders = await getAuthHeaders()

      // 3) Upload faixas no MinIO via proxy (evita 403/CORS do PUT presigned no browser)
      const totalTracks = payload.trackFiles.length
      const faixasToInsert: TablesInsert<'faixa'>[] = []

      for (let i = 0; i < payload.trackFiles.length; i++) {
        const file = payload.trackFiles[i]
        progress.value = 20 + Math.round((60 * (i + 1)) / totalTracks)
        progressLabel.value = `Enviando faixa ${i + 1}/${totalTracks}...`

        const contentType = file.type || 'audio/mpeg'
        const data = await fileToBase64(file)
        const { publicUrl } = await $fetch<{ publicUrl: string }>(
          '/api/upload/faixa-proxy',
          {
            method: 'POST',
            body: {
              cdId,
              ordem: i + 1,
              filename: file.name,
              contentType,
              data,
            },
            headers: authHeaders,
            credentials: 'include',
          }
        )
        faixasToInsert.push({
          cd_id: cdId,
          titulo: file.name.replace(/\.[^/.]+$/, ''),
          ordem: i + 1,
          arquivo_url: publicUrl,
        })
      }

      progressLabel.value = 'Salvando faixas...'
      if (faixasToInsert.length > 0) {
        const { error: faixasErr } = await supabase.from('faixa').insert(faixasToInsert)
        if (faixasErr) {
          error.value = faixasErr.message
          return { success: false }
        }
      }

      progress.value = 100
      progressLabel.value = 'Concluído'
      return { success: true, cdId }
    } catch (e) {
      const err = e as { data?: { statusCode?: number; statusMessage?: string; message?: string }; message?: string }
      const msg = err?.data?.statusMessage ?? err?.data?.message ?? (e instanceof Error ? e.message : 'Erro ao publicar CD')
      const status = err?.data?.statusCode
      if (status === 401) error.value = 'Não autenticado'
      else if (status === 403) error.value = 'Acesso negado a este CD'
      else error.value = msg
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    progress: readonly(progress),
    progressLabel: readonly(progressLabel),
    error: readonly(error),
    publish,
  }
}
