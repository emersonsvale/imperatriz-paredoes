/**
 * Upload da capa via servidor (proxy) para contornar 403/CORS no PUT presigned para MinIO.
 * Recebe o arquivo em base64 no body.
 */
import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
import { getAuthUser } from '~~/server/utils/auth'
import { uploadToMinio } from '~~/server/utils/minio'

function createClientWithToken(accessToken: string) {
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_KEY!
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

const EXT_REGEX = /\.([a-zA-Z0-9]+)$/
const MAX_BASE64_SIZE = 10 * 1024 * 1024 // 10 MB para capa

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuthUser(event)
    if (!auth?.user?.id) {
      throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
    }

    const body = await readBody<{
      cdId: string
      filename: string
      contentType: string
      data: string
    }>(event)

    if (!body?.cdId || !body?.filename || !body?.contentType || typeof body?.data !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Corpo inválido: cdId, filename, contentType e data (base64) são obrigatórios',
      })
    }

    const rawLen = (body.data.length * 3) / 4
    if (rawLen > MAX_BASE64_SIZE) {
      throw createError({ statusCode: 400, statusMessage: 'Arquivo da capa muito grande (máx 10 MB)' })
    }

    const client = auth.accessToken
      ? createClientWithToken(auth.accessToken)
      : await serverSupabaseClient(event)
    const { data: cd } = await client
      .from('cd')
      .select('id, perfil_id')
      .eq('id', body.cdId)
      .single()

    if (!cd || cd.perfil_id !== auth.user.id) {
      throw createError({ statusCode: 403, statusMessage: 'Acesso negado a este CD' })
    }

    const ext = EXT_REGEX.exec(body.filename)?.[1]?.toLowerCase() ?? 'jpg'
    const key = `capas/${cd.perfil_id}/${body.cdId}_capa.${ext}`

    let buffer: Buffer
    try {
      buffer = Buffer.from(body.data, 'base64')
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Data da capa inválida (base64)' })
    }
    const publicUrl = await uploadToMinio(key, buffer, body.contentType)
    return { publicUrl }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err
    }
    const message = err instanceof Error ? err.message : 'Erro ao enviar capa'
    console.error('[capa-proxy]', err)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
