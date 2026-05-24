"use client"

import { useState } from "react"
import {
  Archive,
  Check,
  Code,
  Copy,
  Download,
  Film,
  FileText,
  Image as ImageIcon,
  Music,
  QrCode,
  Trash2,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { cn, formatBytes, formatRelativeTime } from "@/lib/utils"
import { getFileIconKind, mimeToLabel } from "@/lib/mime"

export type FileRecord = {
  id: string
  slug: string
  originalName: string
  size: string
  mimeType: string
  status: string
  expiresAt: string
  downloadCount: number
  createdAt: string
  downloadUrl: string
}

type Props = {
  file: FileRecord
  onDelete: (id: string) => void
}

export function FileCard({ file, onDelete }: Props) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isExpired =
    file.status === "EXPIRED" || new Date(file.expiresAt) < new Date()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file.downloadUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch(`/api/files/${file.id}`, { method: "DELETE" })
      onDelete(file.id)
    } catch {
      setDeleting(false)
    }
  }

  const fileIconKind = getFileIconKind(file.mimeType)

  const ttlPct = 100

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/8 bg-white/4 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-wisp/20 hover:bg-white/6 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(168,216,255,0.06)]",
        isExpired ? "opacity-50" : "opacity-100"
      )}
    >
      {!isExpired && (
        <div className="absolute top-0 left-0 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(168,216,255,0.6),transparent)] opacity-80" />
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-wisp/10 bg-wisp/5">
          {fileIconKind === "image" ? (
            <ImageIcon size={18} className="text-wisp/70" strokeWidth={1.5} />
          ) : fileIconKind === "video" ? (
            <Film size={18} className="text-wisp/70" strokeWidth={1.5} />
          ) : fileIconKind === "audio" ? (
            <Music size={18} className="text-wisp/70" strokeWidth={1.5} />
          ) : fileIconKind === "archive" ? (
            <Archive size={18} className="text-wisp/70" strokeWidth={1.5} />
          ) : fileIconKind === "code" ? (
            <Code size={18} className="text-wisp/70" strokeWidth={1.5} />
          ) : (
            <FileText size={18} className="text-wisp/70" strokeWidth={1.5} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="mb-0.5 truncate text-[0.85rem]"
            style={{
              color: isExpired ? "rgba(200,200,230,0.4)" : "#d4d0f0",
            }}
          >
            {file.originalName}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.7rem] text-[rgba(130,125,160,0.7)]">
              {formatBytes(parseInt(file.size))}
            </span>
            <span className="text-[0.7rem] text-white/15">·</span>
            <span className="text-[0.7rem] text-[rgba(130,125,160,0.7)]">
              {mimeToLabel(file.mimeType)}
            </span>
            <span className="text-[0.7rem] text-white/15">·</span>
            <span
              className="text-[0.7rem]"
              style={{
                color: isExpired
                  ? "rgba(255,120,120,0.6)"
                  : ttlPct < 20
                    ? "rgba(240,180,80,0.8)"
                    : "rgba(130,125,160,0.7)",
              }}
            >
              {isExpired ? "Expired" : formatRelativeTime(file.expiresAt)}
            </span>
            {file.downloadCount > 0 && (
              <>
                <span className="text-[0.7rem] text-white/15">·</span>
                <span className="text-[0.7rem] text-[rgba(130,125,160,0.7)]">
                  {file.downloadCount}{" "}
                  {file.downloadCount === 1 ? "download" : "downloads"}
                </span>
              </>
            )}
          </div>
        </div>

        {!isExpired && (
          <div className="flex shrink-0 items-center gap-1.5">
            <ActionButton
              onClick={handleCopy}
              title="Copy link"
              active={copied}
            >
              {copied ? (
                <Check size={13} className="text-emerald-200" />
              ) : (
                <Copy size={13} />
              )}
            </ActionButton>

            <ActionButton
              onClick={() => setShowQR((value) => !value)}
              title="Show QR code"
              active={showQR}
            >
              <QrCode size={13} />
            </ActionButton>

            <a href={`/api/files/${file.id}/download`}>
              <ActionButton title="Download" onClick={() => {}}>
                <Download size={13} />
              </ActionButton>
            </a>

            <ActionButton
              onClick={handleDelete}
              title="Delete"
              danger
              loading={deleting}
            >
              <Trash2 size={13} />
            </ActionButton>
          </div>
        )}
      </div>

      {showQR && !isExpired && (
        <div className="mt-4 flex flex-col items-center gap-3 border-t border-white/10 pt-4">
          <div className="overflow-hidden rounded-xl bg-white p-2.5">
            <QRCodeSVG
              value={file.downloadUrl}
              size={140}
              level="M"
              fgColor="#070b18"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-center font-heading text-[0.6rem] tracking-[0.12em] text-wisp/40 uppercase">
            Scan to download
          </p>
        </div>
      )}
    </div>
  )
}

function ActionButton({
  onClick,
  title,
  children,
  active,
  danger,
  loading,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
  active?: boolean
  danger?: boolean
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-150",
        active
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
          : danger
            ? "border-red-400/20 bg-red-500/5 text-red-300 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
            : "border-white/10 bg-white/5 text-wisp/50 hover:border-wisp/25 hover:bg-wisp/10 hover:text-wisp/90",
        loading && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  )
}
