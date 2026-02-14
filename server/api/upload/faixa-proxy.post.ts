/**
 * Upload de faixa (áudio) via servidor (proxy) para MinIO.
 * VERSÃO BLINDADA: Faz trim() nas chaves para evitar erro de assinatura.
 */
import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
import { getAuthUser } from '~~/server/utils/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NodeHttpHandler } from "@smithy/node-http-handler"
import https from 'https'

// --- 0. PREPARAÇÃO E LIMPEZA DE CREDENCIAIS ---
// Remove espaços em branco que vêm do copy-paste do .env
const ACCESS_KEY = process.env.MINIO_ACCESS_KEY?.trim() || ''
const SECRET_KEY = process.env.MINIO_SECRET_KEY?.trim() || ''
const ENDPOINT = process.env.MINIO_ENDPOINT?.trim() || ''

// Debug de Segurança (Não mostra a senha, só o tamanho para você conferir)
console.log('🔍 DEBUG MINIO CONFIG:', {
  endpoint: ENDPOINT,
  accessKeyLen: ACCESS_KEY.length,
  secretKeyLen: SECRET_KEY.length, // Se tiver espaço extra, o tamanho vai estar maior do que você espera
  hasHttps: ENDPOINT.startsWith('https')
})

// --- 1. CONFIGURAÇÃO AVANÇADA DO MINIO ---
const agent = new https.Agent({
  rejectUnauthorized: false
})

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: ENDPOINT,
  forcePathStyle: true, 
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
    requestTimeout: 300000, 
    connectionTimeout: 5000, 
  }),
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

const BUCKET_NAME = (process.env.MINIO_BUCKET?.trim()) || 'musicas'

// -----------------------------------------------------------

function createClientWithToken(accessToken: string) {
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_KEY!
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

const EXT_REGEX = /\.([a-zA-Z0-9]+)$/
const MAX_RAW_SIZE = 200 * 1024 * 1024 

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_')
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuthUser(event)
    if (!auth?.user?.id) {
      throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
    }

    const body = await readBody<{
      cdId: string
      ordem: number
      filename: string
      contentType: string
      data: string
    }>(event)

    if (!body?.filename || !body?.data) {
      throw createError({ statusCode: 400, statusMessage: 'Dados incompletos' })
    }

    // Validação de Tamanho
    const rawLen = (body.data.length * 3) / 4
    if (rawLen > MAX_RAW_SIZE) {
      throw createError({ statusCode: 400, statusMessage: 'Arquivo muito grande (máx 200 MB)' })
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
      throw createError({ statusCode: 403, statusMessage: 'Sem permissão' })
    }

    const ext = EXT_REGEX.exec(body.filename)?.[1]?.toLowerCase() ?? 'mp3'
    const baseName = body.filename.replace(/\.[^/.]+$/, '') || `faixa-${body.ordem}`
    const safeName = sanitizeFileName(baseName)
    const key = `audios/${cd.perfil_id}/${body.cdId}/${body.ordem}_${safeName}.${ext}`

    // LIMPEZA CRÍTICA DO BASE64
    const base64Clean = body.data.replace(/^data:.*?;base64,/, '')
    
    let buffer: Buffer
    try {
      buffer = Buffer.from(base64Clean, 'base64')
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Base64 inválido' })
    }

    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: body.contentType || 'audio/mpeg', // Garante tipo de áudio
      })
      
      await s3Client.send(command)
      
    } catch (s3Error: any) {
      console.error('❌ ERRO DETALHADO MINIO:', {
        message: s3Error.message,
        endpoint: ENDPOINT,
        bucket: BUCKET_NAME,
        keyUsedLen: ACCESS_KEY.length // Verifica se o tamanho da chave bate
      })
      throw createError({ statusCode: 502, statusMessage: `Erro Storage: ${s3Error.message}` })
    }

    const baseUrl = process.env.MINIO_PUBLIC_URL?.trim().replace(/\/$/, '')
    const publicUrl = `${baseUrl}/${key}`

    return { publicUrl }

  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err
    }
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('[faixa-proxy error]', message)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})