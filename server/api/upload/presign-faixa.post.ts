/**
 * Gera URL pré-assinada para upload de áudio (faixa) do CD no MinIO.
 * Requer autenticação (cookie ou header Authorization Bearer); o CD deve pertencer ao usuário (perfil_id).
 */
import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
import { getAuthUser } from '~~/server/utils/auth'
import { getPresignedPut } from '~~/server/utils/minio'

function createClientWithToken(accessToken: string) {
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_KEY!
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

const EXT_REGEX = /\.([a-zA-Z0-9]+)$/

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_')
}

export default defineEventHandler(async (event) => {
  const auth = await getAuthUser(event)
  if (!auth?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }
  const user = auth.user

  const body = await readBody<{
    cdId: string
    ordem: number
    filename: string
    contentType: string
  }>(event)
  if (
    !body?.cdId ||
    typeof body?.ordem !== 'number' ||
    !body?.filename ||
    !body?.contentType
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Corpo inválido: cdId, ordem, filename e contentType são obrigatórios',
    })
  }

  const client = auth.accessToken
    ? createClientWithToken(auth.accessToken)
    : await serverSupabaseClient(event)
  const { data: cd } = await client
    .from('cd')
    .select('id, perfil_id')
    .eq('id', body.cdId)
    .single()

  if (!cd || cd.perfil_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso negado a este CD' })
  }

  const ext = EXT_REGEX.exec(body.filename)?.[1]?.toLowerCase() ?? 'mp3'
  const baseName = body.filename.replace(/\.[^/.]+$/, '') || `faixa-${body.ordem}`
  const safeName = sanitizeFileName(baseName)
  const key = `audios/${cd.perfil_id}/${body.cdId}/${body.ordem}_${safeName}.${ext}`

  const { uploadUrl, publicUrl } = await getPresignedPut(key, body.contentType)
  return { uploadUrl, publicUrl }
})
