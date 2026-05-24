import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { WispBackground } from "@/components/wisp-background"
import { LoginButtons } from "@/components/login-buttons"
import { Wisp } from "@/components/wisp"

const stars = Array.from({ length: 60 }, () => ({
  size: Math.random() < 0.2 ? 2 : 1,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: 0.1 + Math.random() * 0.3,
  duration: 3 + Math.random() * 5,
  delay: Math.random() * 5,
}))

export default async function LandingPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      <WispBackground />

      {/* Stars */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-1">
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              animation: `pulse-glow ${star.duration}s ease-in-out infinite ${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex max-w-130 flex-col items-center px-6 text-center">
        {/* Logo mark */}
        <div className="relative mb-8">
          <Wisp variant="orbit" />
        </div>

        {/* Brand name */}
        <h1 className="mb-3 animate-[shimmer_4s_linear_infinite] bg-[linear-gradient(90deg,#a8d8ff_0%,#ffffff_30%,#c4aaff_60%,#a8d8ff_100%)] bg-size-[200%_auto] bg-clip-text font-heading text-[clamp(3rem,10vw,5rem)] leading-none font-semibold tracking-[0.25em] text-transparent">
          WISP
        </h1>

        {/* Tagline */}
        <p className="mb-2 text-[1.2rem] tracking-wider text-[rgba(180,175,220,0.8)] italic">
          Ephemeral files, carried on the wind
        </p>
        <p className="mb-10 max-w-85 text-[0.85rem] tracking-[0.03em] text-[rgba(140,135,170,0.7)]">
          Upload a file. Receive a link. Watch it vanish.
        </p>

        {/* Login card */}
        <div className="w-full max-w-90 rounded-2xl border border-white/8 bg-white/4 p-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <p className="mb-5 text-center font-heading text-[0.7rem] tracking-[0.18em] text-wisp/60 uppercase">
            Enter the archive
          </p>

          <LoginButtons />
        </div>

        {/* Fine print */}
        <p className="mt-6 max-w-[320px] text-center text-[0.72rem] leading-6 text-[rgba(120,115,150,0.6)]">
          Files fade away when their time is up.
        </p>
      </div>
    </main>
  )
}
