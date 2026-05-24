import { clsx, type ClassValue } from "clsx"
import { randomBytes } from "node:crypto"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format bytes to a human-readable string */
export function formatBytes(bytes: number | bigint, decimals = 2): string {
  const n = typeof bytes === "bigint" ? Number(bytes) : bytes
  if (n === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(n) / Math.log(k))
  return `${parseFloat((n / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/** Format a relative time from now */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const diff = d.getTime() - Date.now()
  const abs = Math.abs(diff)
  const past = diff < 0

  if (abs < 60_000) return past ? "just expired" : "in a moment"
  if (abs < 3_600_000) {
    const m = Math.round(abs / 60_000)
    return past ? `${m}m ago` : `${m}m left`
  }
  if (abs < 86_400_000) {
    const h = Math.round(abs / 3_600_000)
    return past ? `${h}h ago` : `${h}h left`
  }
  const day = Math.round(abs / 86_400_000)
  return past ? `${day}d ago` : `${day}d left`
}

/** Generate a cryptographically random slug */
export function randomSlug(length = 10): string {
  const bytes = new Uint8Array(length)
  // In Node.js this is available globally via the Web Crypto API (Node 20+)
  // or via crypto module
  if (typeof globalThis.crypto !== "undefined") {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    // Fallback for older Node versions
    const buf = randomBytes(length)
    buf.copy(Buffer.from(bytes.buffer))
  }
  // Base64url encode and take first `length` chars
  return Buffer.from(bytes)
    .toString("base64url")
    .slice(0, length)
    .replace(/[^a-zA-Z0-9]/g, "x") // extra safety
}

/** Get the public app URL */
export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  )
}

/** Build the full download page URL for a file slug */
export function buildDownloadUrl(slug: string): string {
  return `${getAppUrl()}/d/${slug}`
}
