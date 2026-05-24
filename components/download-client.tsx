"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  Archive,
  Clock,
  Code,
  Download,
  Film,
  FileText,
  Image as ImageIcon,
  Music,
} from "lucide-react"

import { formatBytes, formatRelativeTime } from "@/lib/utils"
import { getFileIconKind, mimeToLabel } from "@/lib/mime"
import { Wisp } from "./wisp"

type FileData = {
  id: string
  originalName: string
  size: string
  mimeType: string
  expiresAt: string
  downloadCount: number
  isExpired: boolean
}

export function DownloadClient({ file }: { file: FileData }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    formatRelativeTime(file.expiresAt)
  )
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (file.isExpired) return

    const id = setInterval(() => {
      setTimeLeft(formatRelativeTime(file.expiresAt))
    }, 30_000)

    return () => clearInterval(id)
  }, [file.expiresAt, file.isExpired])

  const handleDownload = () => {
    setDownloading(true)
    window.location.href = `/api/files/${file.id}/download`
    setTimeout(() => setDownloading(false), 3000)
  }

  const isUrgent = false
  const fileIconKind = getFileIconKind(file.mimeType)

  return (
    <div className="animate-scale-in overflow-hidden rounded-2xl border border-white/8 bg-[rgba(10,12,20,0.6)] shadow-[0_0_60px_rgba(168,216,255,0.08),0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      {!file.isExpired && (
        <div className="h-px bg-[linear-gradient(90deg,transparent_0%,rgba(168,216,255,0.7)_50%,transparent_100%)]" />
      )}

      <div className="p-8">
        <div className="mb-6 flex justify-center">
          {file.isExpired ? (
            <div className="flex h-18 w-18 items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 shadow-[0_0_30px_rgba(255,80,80,0.15)]">
              <AlertTriangle
                size={28}
                className="text-red-200"
                strokeWidth={1.5}
              />
            </div>
          ) : (
            <Wisp variant="floating" />
          )}
        </div>

        <div className="mb-8 text-center">
          <p
            className="mb-2 font-heading text-[0.65rem] font-medium tracking-[0.2em] uppercase"
            style={{
              color: file.isExpired
                ? "rgba(255,130,130,0.8)"
                : "rgba(168,216,255,0.8)",
            }}
          >
            {file.isExpired ? "This wisp has faded" : "A wisp awaits"}
          </p>
          <h1
            className="truncate px-2 font-heading text-[clamp(1rem,4vw,1.3rem)] font-medium tracking-[0.02em]"
            title={file.originalName}
            style={{
              color: file.isExpired ? "rgba(220,200,200,0.6)" : "#ffffff",
              textShadow: file.isExpired
                ? "none"
                : "0 0 20px rgba(168,216,255,0.3)",
            }}
          >
            {file.originalName}
          </h1>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3">
          <MetaCard
            icon={
              fileIconKind === "image" ? (
                <ImageIcon
                  size={14}
                  className="text-wisp/80"
                  strokeWidth={1.5}
                />
              ) : fileIconKind === "video" ? (
                <Film size={14} className="text-wisp/80" strokeWidth={1.5} />
              ) : fileIconKind === "audio" ? (
                <Music size={14} className="text-wisp/80" strokeWidth={1.5} />
              ) : fileIconKind === "archive" ? (
                <Archive size={14} className="text-wisp/80" strokeWidth={1.5} />
              ) : fileIconKind === "code" ? (
                <Code size={14} className="text-wisp/80" strokeWidth={1.5} />
              ) : (
                <FileText
                  size={14}
                  className="text-wisp/80"
                  strokeWidth={1.5}
                />
              )
            }
            label="Type"
            value={mimeToLabel(file.mimeType)}
            expired={file.isExpired}
          />
          <MetaCard
            icon={
              <div className="flex h-3.5 w-3.5 items-center justify-center text-[0.65rem] text-wisp/80">
                ⬡
              </div>
            }
            label="Size"
            value={formatBytes(parseInt(file.size))}
            expired={file.isExpired}
          />
          <div className="col-span-2">
            <MetaCard
              icon={
                <Clock
                  size={14}
                  className={isUrgent ? "text-amber-300" : "text-wisp/80"}
                  strokeWidth={1.5}
                />
              }
              label={file.isExpired ? "Expired" : "Expires"}
              value={file.isExpired ? "Gone forever" : timeLeft}
              expired={file.isExpired}
              urgent={isUrgent}
            />
          </div>
        </div>

        {!file.isExpired ? (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-wisp/40 bg-linear-to-br from-wisp/20 to-aether/15 py-3.5 font-heading text-[0.8rem] font-semibold tracking-[0.12em] text-white transition-all duration-300 hover:border-wisp/50 hover:shadow-[0_0_20px_rgba(168,216,255,0.15),0_0_40px_rgba(168,216,255,0.08)] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-wisp/70"
          >
            {downloading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-wisp/30 border-t-wisp" />
                Summoning…
              </>
            ) : (
              <>
                <Download size={16} strokeWidth={2} />
                Download this wisp
              </>
            )}
          </button>
        ) : (
          <div className="flex w-full items-center justify-center rounded-xl border border-red-400/25 bg-red-500/5 py-3.5">
            <p className="font-heading text-[0.75rem] font-semibold tracking-[0.12em] text-red-200/80 uppercase">
              This file has expired
            </p>
          </div>
        )}

        <p className="mt-6 text-center font-heading text-[0.6rem] font-medium tracking-[0.16em] text-wisp/50 uppercase">
          Delivered by Wisp
        </p>
      </div>
    </div>
  )
}

function MetaCard({
  icon,
  label,
  value,
  expired,
  urgent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  expired?: boolean
  urgent?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="font-heading text-[0.65rem] font-medium tracking-widest text-wisp/65 uppercase">
          {label}
        </span>
      </div>
      <p
        className="text-[0.85rem] font-medium"
        style={{
          color: expired
            ? "rgba(255,160,160,0.7)"
            : urgent
              ? "rgba(255,200,100,0.95)"
              : "rgba(240,245,255,0.95)",
        }}
      >
        {value}
      </p>
    </div>
  )
}
