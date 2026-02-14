/**
 * Re-exporta o utilitário S3/MinIO centralizado.
 * A lógica está em server/utils/s3.ts (instância correta do cliente, presign vs server-side).
 */
import {
  getPresignedUrl,
  getS3Client,
  uploadServerSide,
} from '~~/server/utils/s3'

export { getS3Client as createS3Client }

export async function getPresignedPut(
  key: string,
  contentType?: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  return getPresignedUrl(key, contentType)
}

// getPublicObjectUrl é auto-importado de s3.ts pelo Nitro (não re-exportar para evitar "Duplicated imports")

export async function uploadToMinio(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  return uploadServerSide(key, body, contentType)
}
