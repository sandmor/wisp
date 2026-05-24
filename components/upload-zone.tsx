"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { normalizeMimeType } from "@/lib/mime"

export type UploadedFile = {
  fileId: string
  slug: string
  downloadUrl: string
  originalName: string
  size: number
  mimeType: string
}

type UploadState =
  | { status: "idle" }
  | {
      status: "uploading"
      progress: number
      fileName: string
      fileSize: number
    }
  | { status: "confirming" }
  | { status: "error"; message: string }

type TTLOption = { hours: number; label: string; sublabel: string }

const TTL_OPTIONS: TTLOption[] = [
  { hours: 1, label: "1 hour", sublabel: "Quick share" },
  { hours: 6, label: "6 hours", sublabel: "Half a day" },
  { hours: 24, label: "1 day", sublabel: "Standard" },
  { hours: 72, label: "3 days", sublabel: "Extended" },
  { hours: 168, label: "1 week", sublabel: "Long-lived" },
]

type Props = {
  onUploadComplete: (file: UploadedFile) => void
}

export function UploadZone({ onUploadComplete }: Props) {
  const [ttlHours, setTtlHours] = useState(24)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
  })

  const uploadFile = useCallback(
    async (file: File) => {
      setUploadState({
        status: "uploading",
        progress: 0,
        fileName: file.name,
        fileSize: file.size,
      })

      try {
        // Step 1: Get presigned URL from our API
        const presignRes = await fetch("/api/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            mimeType: normalizeMimeType(file.type),
            ttlHours,
          }),
        })

        if (!presignRes.ok) {
          const err = await presignRes.json()
          throw new Error(err.error ?? "Failed to initiate upload")
        }

        const { fileId, slug, presignedUrl, downloadUrl } =
          await presignRes.json()

        // Step 2: Upload directly to S3 via presigned PUT URL
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setUploadState({
                status: "uploading",
                progress: Math.round((e.loaded / e.total) * 100),
                fileName: file.name,
                fileSize: file.size,
              })
            }
          })

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`S3 upload failed: ${xhr.status}`))
          })

          xhr.addEventListener("error", () =>
            reject(new Error("Network error during upload"))
          )
          xhr.addEventListener("abort", () =>
            reject(new Error("Upload aborted"))
          )

          xhr.open("PUT", presignedUrl)
          xhr.setRequestHeader("Content-Type", normalizeMimeType(file.type))
          xhr.send(file)
        })

        // Step 3: Confirm upload with our API
        setUploadState({ status: "confirming" })
        const confirmRes = await fetch(`/api/files/${fileId}/confirm`, {
          method: "PATCH",
        })

        if (!confirmRes.ok) throw new Error("Failed to confirm upload")

        onUploadComplete({
          fileId,
          slug,
          downloadUrl,
          originalName: file.name,
          size: file.size,
          mimeType: normalizeMimeType(file.type),
        })

        setUploadState({ status: "idle" })
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred"
        setUploadState({ status: "error", message })
      }
    },
    [ttlHours, onUploadComplete]
  )

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) uploadFile(accepted[0])
    },
    [uploadFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled:
      uploadState.status === "uploading" || uploadState.status === "confirming",
    maxSize:
      parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? "500", 10) *
      1024 *
      1024,
  })

  const isIdle = uploadState.status === "idle" || uploadState.status === "error"

  return (
    <div className="flex flex-col gap-6">
      {/* TTL picker */}
      <div>
        <p className="mb-2.5 font-heading text-[0.65rem] tracking-[0.16em] text-wisp/50 uppercase">
          Wisp duration
        </p>
        <div className="grid grid-cols-5 gap-2">
          {TTL_OPTIONS.map((opt) => (
            <button
              key={opt.hours}
              onClick={() => setTtlHours(opt.hours)}
              disabled={!isIdle}
              className={
                ttlHours === opt.hours
                  ? "rounded-lg border border-wisp/45 bg-wisp/10 px-1 py-2 text-center shadow-[0_0_12px_rgba(168,216,255,0.1)] transition-all duration-200 disabled:opacity-40"
                  : "rounded-lg border border-white/10 bg-white/5 px-1 py-2 text-center transition-all duration-200 disabled:opacity-40"
              }
            >
              <span
                className={
                  ttlHours === opt.hours
                    ? "block font-heading text-[0.75rem] font-semibold text-wisp"
                    : "block font-heading text-[0.75rem] text-[rgba(200,200,230,0.6)]"
                }
              >
                {opt.label}
              </span>
              <span
                className={
                  ttlHours === opt.hours
                    ? "mt-0.5 block text-[0.6rem] text-wisp/60"
                    : "mt-0.5 block text-[0.6rem] text-[rgba(140,135,165,0.5)]"
                }
              >
                {opt.sublabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div {...getRootProps()} className="w-full focus:outline-none">
        <input {...getInputProps()} />
        <motion.div
          animate={{
            backgroundColor: isDragActive
              ? "rgba(168,216,255,0.06)"
              : "rgba(255,255,255,0.02)",
            borderColor: isDragActive
              ? "rgba(168,216,255,0.4)"
              : "rgba(168,216,255,0.08)",
            boxShadow: isDragActive
              ? "0 0 40px rgba(168,216,255,0.15), inset 0 0 30px rgba(168,216,255,0.05)"
              : "0 0 0px rgba(168,216,255,0)",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative flex min-h-65 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-solid"
        >
          <AnimatePresence mode="wait">
            {uploadState.status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6 select-none"
              >
                <div className="relative flex h-16 w-16 items-center justify-center">
                  {/* Breathing Wisp Aura */}
                  <motion.div
                    animate={{
                      scale: isDragActive ? [1.2, 1.5, 1.2] : [1, 1.2, 1],
                      opacity: isDragActive ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: isDragActive ? 1.5 : 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(168,216,255,0.4) 0%, transparent 70%)",
                    }}
                  />

                  {/* Icon Container */}
                  <motion.div
                    animate={{ y: isDragActive ? -5 : 0 }}
                    className="relative flex h-full w-full items-center justify-center rounded-full"
                    style={{
                      border: "1px solid rgba(168,216,255,0.25)",
                      background: "rgba(168,216,255,0.08)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Upload
                      size={24}
                      color="rgba(168,216,255,0.9)"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>

                <div className="z-10 text-center">
                  <p className="mb-1.5 text-[0.9rem] text-[rgba(200,200,230,0.9)]">
                    {isDragActive
                      ? "Release to bind the spirit"
                      : "Drop your wisp here"}
                  </p>
                  <p className="text-[0.75rem] text-[rgba(130,125,160,0.7)]">
                    or{" "}
                    <span className="cursor-pointer underline decoration-white/30 underline-offset-2 transition-colors hover:text-wisp">
                      browse your archives
                    </span>
                  </p>
                </div>
              </motion.div>
            )}

            {uploadState.status === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 flex w-full flex-col items-center gap-6 px-8"
              >
                {/* True Animated Wisp */}
                <motion.div
                  animate={{
                    y: [0, -10, 0, 8, 0],
                    x: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex h-14 w-14 items-center justify-center"
                >
                  {/* Inner Core */}
                  <div
                    className="h-8 w-8 rounded-full blur-[2px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.9), rgba(168,216,255,0.8))",
                      boxShadow:
                        "0 0 20px rgba(168,216,255,0.8), 0 0 40px #c4aaff",
                    }}
                  />
                  {/* Orbiting Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border border-[#a8d8ff] opacity-40"
                    style={{
                      borderTopColor: "transparent",
                      borderBottomColor: "transparent",
                    }}
                  />
                </motion.div>

                <div className="w-full text-center">
                  <p className="mb-1 font-heading text-[0.75rem] tracking-widest text-wisp">
                    Transmitting…
                  </p>
                  <p className="mx-auto max-w-60 truncate text-[0.75rem] text-[rgba(170,165,200,0.7)]">
                    {uploadState.fileName}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-60">
                  <div className="w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-1 rounded-full bg-linear-to-r from-wisp to-aether shadow-[0_0_10px_rgba(168,216,255,0.6)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadState.progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {uploadState.status === "confirming" && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 flex flex-col items-center gap-5"
              >
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <motion.div
                    animate={{ scale: [0.8, 1.5], opacity: [0.6, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full border border-[#a8d8ff]"
                  />
                  <motion.div
                    animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-3 w-3 rounded-full bg-wisp shadow-[0_0_15px_rgba(168,216,255,0.8)]"
                  />
                </div>
                <p className="font-heading text-[0.75rem] tracking-widest text-wisp/90">
                  Weaving your link…
                </p>
              </motion.div>
            )}

            {uploadState.status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center gap-3 px-8 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-xl text-red-400 shadow-[0_0_20px_rgba(255,80,80,0.15)]">
                  ✦
                </div>
                <div>
                  <p className="mb-1 text-[0.85rem] text-red-200/90">
                    The connection broke.
                  </p>
                  <p className="text-[0.75rem] text-[rgba(200,160,160,0.6)]">
                    {uploadState.message}
                  </p>
                </div>
                <button
                  onClick={() => setUploadState({ status: "idle" })}
                  className="mt-2 rounded-lg border border-red-500/30 px-4 py-2 text-xs text-red-200 transition-colors hover:bg-red-500/10"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
