"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Check, Copy, Download, ExternalLink, X } from "lucide-react"

import { formatBytes } from "@/lib/utils"
import { mimeToLabel } from "@/lib/mime"
import type { UploadedFile } from "./upload-zone"

type Props = {
  file: UploadedFile
  onClose: () => void
}

export function QRModal({ file, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file.downloadUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,6,16,0.85)] p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-105 animate-scale-in overflow-hidden rounded-2xl border border-wisp/15 bg-[rgba(10,12,20,0.72)] shadow-[0_0_60px_rgba(168,216,255,0.08),0_0_120px_rgba(168,216,255,0.04),0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 h-px w-50 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(168,216,255,0.5),transparent)]" />

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 shrink-0 rounded-full bg-[radial-gradient(circle,rgba(180,255,220,0.9),rgba(100,220,160,0.5))] shadow-[0_0_10px_rgba(100,220,160,0.5)]" />
            <h2 className="font-heading text-[0.8rem] tracking-[0.15em] text-wisp uppercase">
              Wisp dispatched
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-[rgba(180,175,210,0.5)] transition-colors duration-150 hover:text-[rgba(180,175,210,0.9)]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 px-6 py-6">
          <div className="relative">
            {[
              "top-0 left-0",
              "top-0 right-0",
              "bottom-0 left-0",
              "bottom-0 right-0",
            ].map((position, index) => (
              <div
                key={position}
                className={`absolute ${position} h-4 w-4 ${
                  index < 2
                    ? "border-t border-wisp/40"
                    : "border-b border-wisp/40"
                } ${index % 2 === 0 ? "border-l border-wisp/40" : "border-r border-wisp/40"}`}
              />
            ))}

            <div className="overflow-hidden rounded-xl bg-white p-3">
              <QRCodeSVG
                value={file.downloadUrl}
                size={200}
                level="M"
                fgColor="#070b18"
                bgColor="#ffffff"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="mb-1 max-w-[320px] truncate text-[0.88rem] text-[#d4d0f0]">
              {file.originalName}
            </p>
            <p className="text-[0.72rem] text-[rgba(140,135,165,0.6)]">
              {mimeToLabel(file.mimeType)} · {formatBytes(file.size)}
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="flex-1 truncate font-mono text-[0.72rem] text-wisp/70">
              {file.downloadUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.7rem] transition-all duration-200"
              style={{
                background: copied
                  ? "rgba(100,220,160,0.15)"
                  : "rgba(168,216,255,0.1)",
                borderColor: copied
                  ? "rgba(100,220,160,0.3)"
                  : "rgba(168,216,255,0.2)",
                color: copied ? "#70e0a8" : "#a8d8ff",
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="flex w-full gap-3">
            <a
              href={file.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-wisp/30 bg-linear-to-br from-wisp/15 via-aether/10 to-wisp/10 py-2.5 text-sm text-white transition-all duration-300 hover:border-wisp/50 hover:text-[#e8f4ff] hover:shadow-[0_0_20px_rgba(168,216,255,0.2),0_0_40px_rgba(168,216,255,0.05)]"
            >
              <ExternalLink size={14} />
              Open link
            </a>
            <a
              href={`/api/files/${file.fileId}/download`}
              className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gold/35 bg-linear-to-br from-gold/20 to-gold/10 py-2.5 text-sm text-[#f0d080] transition-all duration-300 hover:border-gold/55 hover:text-[#ffe090] hover:shadow-[0_0_20px_rgba(240,200,112,0.15)]"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
