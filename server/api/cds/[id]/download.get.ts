/**
 * Download do CD completo em ZIP: busca todas as faixas, monta um ZIP e faz stream.
 */
import archiver from 'archiver'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do CD é obrigatório' })
  }

  const supabase = await serverSupabaseClient(event)

  const { data: cdRow, error: cdError } = await supabase
    .from('cd')
    .select('id, titulo')
    .eq('id', id)
    .single()

  if (cdError || !cdRow) {
    throw createError({ statusCode: 404, statusMessage: 'CD não encontrado' })
  }

  const { data: faixas, error: faixasError } = await supabase
    .from('faixa')
    .select('id, titulo, ordem, arquivo_url')
    .eq('cd_id', id)
    .order('ordem', { ascending: true })

  if (faixasError || !faixas?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Nenhuma faixa encontrada para este CD' })
  }

  const faixasComUrl = faixas.filter(
    (f: { arquivo_url: string | null }) => f.arquivo_url?.trim()
  ) as { id: string; titulo: string | null; ordem: number | null; arquivo_url: string }[]

  if (faixasComUrl.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Nenhum arquivo de faixa disponível para download' })
  }

  await supabase.rpc('increment_cd_downloads', { p_cd_id: id })

  const tituloCd = (cdRow as { titulo: string | null }).titulo ?? 'CD'
  const zipFilename = `${sanitizeFileName(tituloCd)}.zip`

  const nodeRes = getResponseNode(event)
  if (!nodeRes) {
    throw createError({ statusCode: 500, statusMessage: 'Stream de resposta não disponível' })
  }

  setResponseHeaders(event, {
    'Content-Disposition': `attachment; filename="${zipFilename}"`,
    'Content-Type': 'application/zip',
  })

  const archive = archiver('zip', { zlib: { level: 6 } })
  archive.on('error', (err) => {
    console.error('[cd download zip]', err)
  })
  archive.pipe(nodeRes)

  for (const faixa of faixasComUrl) {
    const ext = getExtensionFromUrl(faixa.arquivo_url)
    const nomeArquivo = `${String(faixa.ordem ?? 0).padStart(2, '0')} - ${sanitizeFileName(faixa.titulo ?? 'Faixa')}${ext}`
    try {
      const res = await fetch(faixa.arquivo_url, { method: 'GET' })
      if (!res.ok) continue
      const buffer = Buffer.from(await res.arrayBuffer())
      archive.append(buffer, { name: nomeArquivo })
    } catch (e) {
      console.warn(`[cd download] falha ao incluir faixa ${faixa.id}:`, e)
    }
  }

  await archive.finalize()
})

function getResponseNode(event: any): NodeJS.WritableStream | null {
  const node = (event as { node?: { res?: NodeJS.WritableStream } }).node
  return node?.res ?? null
}

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
