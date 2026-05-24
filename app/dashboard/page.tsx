"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Loader2, Wind } from "lucide-react"

import { FileCard, type FileRecord } from "@/components/file-card"
import { Nav } from "@/components/nav"
import { QRModal } from "@/components/qr-modal"
import { UploadZone, type UploadedFile } from "@/components/upload-zone"
import { WispBackground } from "@/components/wisp-background"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [files, setFiles] = useState<FileRecord[]>([])
  const [loadingFiles, setLoadingFiles] = useState(true)
  const [freshUpload, setFreshUpload] = useState<UploadedFile | null>(null)

  useEffect(() => {
    if (isLoaded && !user) router.replace("/")
  }, [user, isLoaded, router])

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch("/api/files")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files ?? [])
      }
    } catch (error) {
      console.error("Failed to fetch files", error)
    } finally {
      setLoadingFiles(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !user) return

    let active = true

    void (async () => {
      try {
        const response = await fetch("/api/files")
        if (!active) return

        if (response.ok) {
          const data = await response.json()
          setFiles(data.files ?? [])
        }
      } catch (error) {
        console.error("Failed to fetch files", error)
      } finally {
        if (active) setLoadingFiles(false)
      }
    })()

    return () => {
      active = false
    }
  }, [user, isLoaded])

  const handleUploadComplete = (uploaded: UploadedFile) => {
    setFreshUpload(uploaded)
    fetchFiles()
  }

  const handleDelete = (id: string) => {
    setFiles((previous) => previous.filter((file) => file.id !== id))
  }

  const activeFiles = files.filter(
    (file) => file.status !== "EXPIRED" && new Date(file.expiresAt) > new Date()
  )

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <WispBackground />
        <Loader2 className="h-6 w-6 animate-spin text-wisp/50" />
      </div>
    )
  }

  if (!user) return null

  const displayName =
    user.fullName || user.firstName || user.username || "Traveler"

  return (
    <div className="relative flex min-h-dvh flex-col">
      <WispBackground />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <Nav />

        <main className="mx-auto w-full max-w-275 flex-1 px-4 py-8 sm:px-6">
          <div className="mb-8 animate-fade-up">
            <h1 className="mb-1 font-heading text-[clamp(1rem,3vw,1.3rem)] font-medium tracking-[0.15em] text-wisp">
              The Archive
            </h1>
            <p className="text-[0.82rem] text-[rgba(140,135,165,0.7)] italic">
              Welcome back,{" "}
              <span className="text-aether/80">{displayName}</span>
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-6">
            <div
              className="animate-fade-up rounded-2xl border border-white/8 bg-white/4 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6"
              style={{ animationDelay: "0.05s" }}
            >
              <div className="mb-5">
                <h2 className="mb-1 font-heading text-[0.62rem] tracking-[0.18em] text-wisp/50 uppercase">
                  Dispatch a wisp
                </h2>
                <p className="text-[0.77rem] text-[rgba(150,145,180,0.6)]">
                  Upload a file and receive a fleeting link to share across any
                  device.
                </p>
              </div>
              <UploadZone onUploadComplete={handleUploadComplete} />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-heading text-[0.62rem] tracking-[0.18em] text-wisp/50 uppercase">
                  Active wisps
                  {activeFiles.length > 0 && (
                    <span className="inline-flex min-w-4.5 items-center justify-center rounded-full border border-wisp/20 bg-wisp/12 px-1 text-[0.6rem] tracking-normal text-wisp">
                      {activeFiles.length}
                    </span>
                  )}
                </h2>

                {activeFiles.length > 0 && (
                  <button
                    onClick={fetchFiles}
                    className="font-heading text-[0.62rem] tracking-[0.08em] text-wisp/40 uppercase transition-colors duration-150 hover:text-wisp/75"
                  >
                    Refresh
                  </button>
                )}
              </div>

              {loadingFiles ? (
                <div className="flex min-h-50 flex-col items-center justify-center gap-3 rounded-xl border border-white/8 bg-white/4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <Loader2 className="h-5 w-5 animate-spin text-wisp/40" />
                  <p className="text-[0.75rem] text-[rgba(140,135,165,0.5)]">
                    Consulting the archive…
                  </p>
                </div>
              ) : activeFiles.length === 0 ? (
                <div className="flex min-h-50 flex-col items-center justify-center gap-4 rounded-xl border border-white/8 bg-white/4 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <Wind className="h-7 w-7 text-wisp/20" strokeWidth={1} />
                  <div>
                    <p className="mb-1 font-heading text-[0.78rem] tracking-[0.08em] text-wisp/35 uppercase">
                      The archive is empty
                    </p>
                    <p className="text-[0.72rem] text-[rgba(130,125,155,0.45)] italic">
                      Your dispatched wisps will appear here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-5 text-center">
          <p className="font-heading text-[0.62rem] tracking-widest text-white/40 uppercase">
            WISP · Files fade. Links remain. Briefly.
          </p>
        </footer>
      </div>

      {freshUpload && (
        <QRModal file={freshUpload} onClose={() => setFreshUpload(null)} />
      )}
    </div>
  )
}
