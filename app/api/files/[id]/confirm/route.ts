import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

/**
 * Called by the client after a successful presigned PUT to S3.
 * Transitions the file from PENDING -> ACTIVE.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = (await params).id

  const file = await prisma.wispFile.findUnique({
    where: { id },
  })

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  // Ensure the user confirming the file is the one who created it
  if (file.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (file.status !== "PENDING") {
    // Idempotent — already confirmed, just return success
    return NextResponse.json({ success: true, status: file.status })
  }

  await prisma.wispFile.update({
    where: { id },
    data: { status: "ACTIVE" },
  })

  return NextResponse.json({ success: true, status: "ACTIVE" })
}
