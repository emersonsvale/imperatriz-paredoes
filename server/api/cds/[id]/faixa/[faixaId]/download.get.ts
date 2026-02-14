/**
 * Download de uma faixa do CD: faz proxy do arquivo com Content-Disposition
 * para o navegador baixar com nome amigável (ex: 01 - Titulo.mp3).
 */
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const faixaId = getRouterParam(event, 'faixaId')
  if (!id || !faixaId) {
    throw createError({ statusCode: 400, statusMessage: 'ID do CD e da faixa são obrigatórios' })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: faixa, error } = await supabase
    .from('faixa')
    .select('id, titulo, ordem, arquivo_url')
    .eq('id', faixaId)
    .eq('cd_id', id)
    .single()

  if (error || !faixa) {
    throw createError({ statusCode: 404, statusMessage: 'Faixa não encontrada' })
  }

  const arquivoUrl = (faixa as { arquivo_url: string | null }).arquivo_url
  if (!arquivoUrl?.trim()) {
    throw createError({ statusCode: 404, statusMessage: 'Arquivo da faixa não disponível' })
  }

  const titulo = (faixa as { titulo: string | null }).titulo ?? 'Faixa'
  const ordem = (faixa as { ordem: number | null }).ordem ?? 0
  const ext = getExtensionFromUrl(arquivoUrl)
  const filename = `${String(ordem).padStart(2, '0')} - ${sanitizeFileName(titulo)}${ext}`

  const res = await fetch(arquivoUrl, { method: 'GET' })
  if (!res.ok) {
    throw createError({
      statusCode: res.status === 404 ? 404 : 502,
      statusMessage: 'Arquivo não disponível para download',
    })
  }

  const contentType = res.headers.get('content-type') ?? 'audio/mpeg'
  const buffer = Buffer.from(await res.arrayBuffer())

  await supabase.rpc('increment_faixa_downloads', { p_faixa_id: faixaId, p_cd_id: id })

  setResponseHeaders(event, {
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Type': contentType,
    'Content-Length': String(buffer.length),
  })

  return buffer
})

function getExtensionFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    const match = path.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
    return match ? `.${match[1].toLowerCase()}` : '.mp3'
  } catch {
    return '.mp3'
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, '_').slice(0, 200)
}
