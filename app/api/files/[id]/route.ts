import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { deleteObject } from "@/lib/s3"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const file = await prisma.wispFile.findUnique({
    where: { id: id },
  })

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  // Only the owner can delete
  if (file.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Delete from S3 first, then remove DB record
  try {
    await deleteObject(file.s3Key)
  } catch (err) {
    console.error("[wisp] S3 delete error:", err)
    // Continue to remove DB record even if S3 deletion fails
  }

  await prisma.wispFile.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
