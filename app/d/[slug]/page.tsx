import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { WispBackground } from "@/components/wisp-background"
import { DownloadClient } from "../../../components/download-client"
import type { Metadata } from "next"

const stars = Array.from({ length: 40 }, () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: 0.1 + Math.random() * 0.25,
}))

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const file = await prisma.wispFile.findUnique({
    where: { slug },
    select: { originalName: true, status: true },
  })

  if (!file) return { title: "File not found" }
  if (file.status !== "ACTIVE") return { title: "File unavailable" }

  return {
    title: `Download ${file.originalName}`,
    description: "A file has been shared with you via Wisp.",
  }
}

export default async function DownloadPage({ params }: Props) {
  const { slug } = await params
  const file = await prisma.wispFile.findUnique({
    where: { slug },
  })

  if (!file) notFound()

  const isExpired = file.status === "EXPIRED" || file.expiresAt < new Date()

  const fileData = {
    id: file.id,
    originalName: file.originalName,
    size: file.size.toString(),
    mimeType: file.mimeType,
    expiresAt: file.expiresAt.toISOString(),
    downloadCount: file.downloadCount,
    isExpired,
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4">
      <WispBackground />

      {/* Stars */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-1">
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              width: "1px",
              height: "1px",
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Brand link back */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-20 flex items-center gap-2 no-underline"
      >
        <div className="h-5.5 w-5.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(200,235,255,0.9),rgba(140,200,255,0.5)_50%,rgba(100,160,255,0.2))] shadow-[0_0_10px_rgba(168,216,255,0.4)]" />
        <span className="font-heading text-[0.85rem] font-semibold tracking-[0.2em] text-wisp/60">
          WISP
        </span>
      </Link>

      {/* Download card */}
      <div className="relative z-10 w-full max-w-105">
        <DownloadClient file={fileData} />
      </div>
    </main>
  )
}
