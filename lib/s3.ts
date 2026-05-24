import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION ?? "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  // Required for MinIO and other path-style services
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
})

const BUCKET = process.env.S3_BUCKET_NAME!

/**
 * Generate a presigned PUT URL so the browser can upload directly to S3.
 * The URL expires in 1 hour — plenty of time to complete the upload.
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  contentLength: number
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 })
}

/**
 * Generate a short-lived presigned GET URL for downloading a file.
 * Passes Content-Disposition so the browser triggers a download with the
 * original filename rather than showing the S3 key.
 */
export async function createPresignedDownloadUrl(
  key: string,
  originalName: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(
      originalName
    )}`,
  })

  return getSignedUrl(s3, command, { expiresIn })
}

export async function deleteObject(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

/**
 * Build a deterministic S3 key for a file.
 * userId / slug / originalName keeps things namespaced and readable.
 */
export function buildS3Key(
  userId: string,
  slug: string,
  filename: string
): string {
  // Sanitize filename: keep extension, strip unsafe chars
  const ext = filename.split(".").pop() ?? ""
  const safe = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 100)
  return `uploads/${userId}/${slug}/${safe}`
}
