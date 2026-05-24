import Link from "next/link"
import { WispBackground } from "@/components/wisp-background"
import { Wisp } from "@/components/wisp"

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4">
      <WispBackground />

      <div className="relative z-10 max-w-[380px] text-center">
        {/* Faded orb */}
        <div className="mb-6 flex justify-center">
          <Wisp variant="faded" />
        </div>

        <h1 className="mb-3 font-heading text-[0.7rem] tracking-[0.25em] text-wisp/40 uppercase">
          The wisp has faded
        </h1>

        <p className="mb-2 text-[1rem] text-[rgba(180,175,210,0.6)] italic">
          This file doesn&apos;t exist or has expired.
        </p>

        <p className="mb-7 text-[0.75rem] text-[rgba(130,125,155,0.5)]">
          The page you&apos;re looking for has drifted beyond the veil.
        </p>

        <Link
          href="/"
          className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-wisp/30 bg-gradient-to-br from-wisp/15 via-aether/10 to-wisp/10 px-5 py-2.5 text-sm text-white transition-all duration-300 hover:border-wisp/50 hover:text-[#e8f4ff] hover:shadow-[0_0_20px_rgba(168,216,255,0.2),0_0_40px_rgba(168,216,255,0.05)]"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}
