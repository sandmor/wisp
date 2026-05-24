import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { deleteObject } from "@/lib/s3"

type CleanupResult = {
  scanned: number
  deleted: number
  failed: number
}

function isAuthorizedRequest(request: NextRequest) {
  const cleanupSecret = process.env.CLEANUP_SECRET?.trim()

  if (!cleanupSecret) {
    return false
  }

  const authorization = request.headers.get("authorization")
  if (authorization === `Bearer ${cleanupSecret}`) {
    return true
  }

  return false
}

async function cleanupExpiredFiles() {
  const now = new Date()
  const expiredFiles = await prisma.wispFile.findMany({
    where: {
      OR: [{ status: "EXPIRED" }, { expiresAt: { lt: now } }],
    },
    select: {
      id: true,
      s3Key: true,
    },
    orderBy: { expiresAt: "asc" },
  })

  const result: CleanupResult = {
    scanned: expiredFiles.length,
    deleted: 0,
    failed: 0,
  }

  for (const file of expiredFiles) {
    try {
      await deleteObject(file.s3Key)
    } catch (error) {
      result.failed += 1
      console.error("[wisp] Failed to delete expired S3 object", {
        fileId: file.id,
        s3Key: file.s3Key,
        error,
      })
    }

    try {
      await prisma.wispFile.deleteMany({
        where: { id: file.id },
      })
      result.deleted += 1
    } catch (error) {
      result.failed += 1
      console.error("[wisp] Failed to delete expired DB record", {
        fileId: file.id,
        s3Key: file.s3Key,
        error,
      })
    }
  }

  return result
}

async function handleCleanup(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await cleanupExpiredFiles()

  return NextResponse.json(result)
}

export async function GET(request: NextRequest) {
  return handleCleanup(request)
}

export async function POST(request: NextRequest) {
  return handleCleanup(request)
}
