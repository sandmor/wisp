import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { createPresignedDownloadUrl } from "@/lib/s3"

/**
 * Public endpoint. Generates a presigned GET URL and redirects the browser
 * to it, triggering a download with the original filename.
 * No auth required — access is gated only by knowing the slug/id.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const file = await prisma.wispFile.findUnique({
    where: { id },
  })

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  if (file.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "File is not available" },
      { status: 410 }
    )
  }

  if (file.expiresAt < new Date()) {
    // Mark as expired
    await prisma.wispFile.update({
      where: { id },
      data: { status: "EXPIRED" },
    })
    return NextResponse.json({ error: "File has expired" }, { status: 410 })
  }

  // Increment download counter (fire-and-forget)
  prisma.wispFile
    .update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    })
    .catch(console.error)

  // Generate presigned URL valid for 5 minutes — enough to start download
  const signedUrl = await createPresignedDownloadUrl(
    file.s3Key,
    file.originalName,
    300
  )

  return NextResponse.redirect(signedUrl, 302)
}
