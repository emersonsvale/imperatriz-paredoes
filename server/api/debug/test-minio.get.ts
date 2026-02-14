/**
 * Testa uploadServerSide (aws4 + node:https).
 * GET /api/debug/test-minio — REMOVER EM PRODUÇÃO.
 */
import { uploadServerSide } from '~~/server/utils/s3'

export default defineEventHandler(async () => {
  const testKey = `_test_${Date.now()}.txt`
  const testBody = Buffer.from('upload-test-aws4-' + Date.now())

  try {
    const publicUrl = await uploadServerSide(testKey, testBody, 'text/plain')
    return {
      ok: true,
      message: 'Upload via aws4 + node:https FUNCIONOU!',
      publicUrl,
    }
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
})
