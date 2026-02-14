/**
 * Cliente S3/MinIO centralizado (server-only).
 * Upload usa aws4 (SigV4) + node:https — mesma abordagem que Postman/curl.
 * Presigned URLs usam o SDK (cálculo local, sem request HTTP).
 */
import aws4 from 'aws4'
import https from 'node:https'
import http from 'node:http'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// ─── Config ─────────────────────────────────────────────────────────
function getConfig() {
  const endpoint = process.env.MINIO_ENDPOINT?.trim()
  const internalEndpoint = process.env.MINIO_INTERNAL_ENDPOINT?.trim()
  const accessKey = process.env.MINIO_ACCESS_KEY?.trim()
  const secretKey = process.env.MINIO_SECRET_KEY?.trim()
  const bucket = process.env.MINIO_BUCKET?.trim()
  const publicUrl = process.env.MINIO_PUBLIC_URL?.trim()
  if (!endpoint || !accessKey || !secretKey || !bucket || !publicUrl) {
    throw new Error(
      'MinIO config incompleta: defina MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET e MINIO_PUBLIC_URL'
    )
  }
  return { endpoint, internalEndpoint, accessKey, secretKey, bucket, publicUrl }
}

// ─── node:https/http request ────────────────────────────────────────
function doRequest(
  opts: https.RequestOptions & { hostname: string; port: number },
  body: Buffer,
  isHttps: boolean
): Promise<{ statusCode: number; body: string }> {
  const mod = isHttps ? https : http
  return new Promise((resolve, reject) => {
    const req = mod.request(opts, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () =>
        resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks).toString() })
      )
    })
    req.on('error', reject)
    req.setTimeout(120_000, () => req.destroy(new Error('Upload timeout (120s)')))
    req.end(body)
  })
}

// ─── Exports ────────────────────────────────────────────────────────

/**
 * Upload via servidor — aws4 (SigV4) + node:https.
 * Replica exatamente o que Postman faz: assina com aws4, envia com https.request.
 */
export async function uploadServerSide(
  key: string,
  fileBuffer: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const { endpoint, internalEndpoint, accessKey, secretKey, bucket, publicUrl } = getConfig()
  const body = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer)

  const urlToUse = internalEndpoint || endpoint
  const parsed = new URL(urlToUse)
  const isHttps = parsed.protocol === 'https:'

  const keyNorm = key.startsWith('/') ? key.slice(1) : key
  const path = `/${bucket}/${keyNorm}`

  // aws4.sign — mesma assinatura que Postman gera
  const signed = aws4.sign(
    {
      host: parsed.host,
      path,
      method: 'PUT',
      body,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(body.length),
      },
      service: 's3',
      region: 'us-east-1',
    },
    {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    }
  )

  const res = await doRequest(
    {
      hostname: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : isHttps ? 443 : 80,
      path: signed.path,
      method: 'PUT',
      headers: signed.headers,
    },
    body,
    isHttps
  )

  if (res.statusCode !== 200) {
    console.error(`[s3] Upload falhou (HTTP ${res.statusCode}):`, res.body.slice(0, 300))
    throw new Error(`MinIO upload falhou (HTTP ${res.statusCode}): ${res.body.slice(0, 200)}`)
  }

  const base = publicUrl.replace(/\/$/, '')
  return `${base}/${keyNorm}`
}

/**
 * Monta a URL pública de um objeto a partir da key.
 */
export function getPublicObjectUrl(key: string): string {
  const { publicUrl } = getConfig()
  const base = publicUrl.replace(/\/$/, '')
  const keyNorm = key.startsWith('/') ? key.slice(1) : key
  return `${base}/${keyNorm}`
}

/**
 * S3Client do SDK — usado APENAS para gerar presigned URLs (cálculo local, sem request HTTP).
 */
export function getS3Client(useInternal = false): S3Client {
  const { endpoint, internalEndpoint, accessKey, secretKey } = getConfig()
  const url = useInternal && internalEndpoint ? internalEndpoint : endpoint
  return new S3Client({
    region: 'us-east-1',
    endpoint: url,
    forcePathStyle: true,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })
}

/**
 * Gera URL pré-assinada para PUT (upload direto do frontend).
 */
export async function getPresignedUrl(
  key: string,
  contentType?: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const { bucket, publicUrl } = getConfig()
  const client = getS3Client(false)
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(contentType && { ContentType: contentType }),
  })
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 })
  const base = publicUrl.replace(/\/$/, '')
  const keyNorm = key.startsWith('/') ? key.slice(1) : key
  return { uploadUrl, publicUrl: `${base}/${keyNorm}` }
}
