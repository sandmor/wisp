import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { normalizeMimeType } from "@/lib/mime"
import { buildS3Key, createPresignedUploadUrl } from "@/lib/s3"
import { buildDownloadUrl, randomSlug } from "@/lib/utils"

/**
 * Returns the authenticated user's files, most recent first.
 */
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const files = await prisma.wispFile.findMany({
    where: {
      userId,
      status: { in: ["ACTIVE", "PENDING"] },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  // Auto-expire stale records (no cleanup of S3 objects here — use a cron job)
  const now = new Date()
  const serialized = files.map((f) => ({
    id: f.id,
    slug: f.slug,
    originalName: f.originalName,
    size: f.size.toString(), // BigInt → string for JSON
    mimeType: f.mimeType,
    status: f.expiresAt < now ? "EXPIRED" : f.status,
    expiresAt: f.expiresAt.toISOString(),
    downloadCount: f.downloadCount,
    createdAt: f.createdAt.toISOString(),
    downloadUrl: buildDownloadUrl(f.slug),
  }))

  return NextResponse.json({ files: serialized })
}

/**
 * Creates a DB record and returns a presigned PUT URL for direct-to-S3 upload.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: {
    name: string
    size: number
    mimeType?: string
    ttlHours: number
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { name, size, mimeType, ttlHours } = body
  const normalizedMimeType = normalizeMimeType(mimeType)

  // Validate input
  if (!name || typeof size !== "number" || typeof ttlHours !== "number") {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const maxBytes =
    parseInt(process.env.MAX_FILE_SIZE_MB ?? "500", 10) * 1024 * 1024
  if (size > maxBytes) {
    return NextResponse.json(
      {
        error: `File exceeds maximum size of ${process.env.MAX_FILE_SIZE_MB ?? 500} MB`,
      },
      { status: 413 }
    )
  }

  const allowedTTLs = (process.env.TTL_OPTIONS_HOURS ?? "1,6,24,72,168")
    .split(",")
    .map(Number)
  if (!allowedTTLs.includes(ttlHours)) {
    return NextResponse.json({ error: "Invalid TTL value" }, { status: 400 })
  }

  // Generate identifiers
  const slug = randomSlug(10)
  const s3Key = buildS3Key(userId, slug, name)
  const expiry = new Date(Date.now() + ttlHours * 3600 * 1000)

  // Create DB record in PENDING state
  const file = await prisma.wispFile.create({
    data: {
      slug,
      userId,
      originalName: name,
      size: BigInt(size),
      mimeType: normalizedMimeType,
      s3Key,
      expiresAt: expiry,
      status: "PENDING",
    },
  })

  // Generate presigned upload URL (valid for 1 hour)
  const presignedUrl = await createPresignedUploadUrl(
    s3Key,
    normalizedMimeType,
    size
  )

  return NextResponse.json({
    fileId: file.id,
    slug: file.slug,
    presignedUrl,
    downloadUrl: buildDownloadUrl(file.slug),
  })
}
