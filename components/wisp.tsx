"use client"

import { motion } from "framer-motion"

type WispVariant = "mini" | "floating" | "orbit" | "faded"

interface WispProps {
  variant?: WispVariant
  className?: string
}

export function Wisp({ variant = "floating", className = "" }: WispProps) {
  if (variant === "mini") {
    // Nav/Link variant: Gentle, subtle breathing and shadow shifting
    return (
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            "0 0 12px rgba(168,216,255,0.4), 0 0 24px rgba(168,216,255,0.1)",
            "0 0 16px rgba(168,216,255,0.8), 0 0 32px rgba(168,216,255,0.2)",
            "0 0 12px rgba(168,216,255,0.4), 0 0 24px rgba(168,216,255,0.1)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`h-7 w-7 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.95),rgba(168,216,255,0.8)_50%,rgba(100,160,255,0.2))] ${className}`}
      />
    )
  }

  if (variant === "orbit") {
    // Hero/Standalone Logo: Large, complex, multi-layered astrolabe effect
    return (
      <div
        className={`relative flex h-30 w-30 items-center justify-center ${className}`}
      >
        {/* Deep background breathing aura */}
        <motion.div
          animate={{ scale: [2, 2.5, 2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(168,216,255,0.2)_0%,transparent_70%)] blur-xl"
        />

        {/* Outer tracking ring */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0 rounded-full border border-white/15"
        />

        {/* Dashed counter-rotating middle ring */}
        <motion.div
          animate={{ rotate: -360, scale: [1, 0.95, 1] }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-2 rounded-full border border-dashed border-[#c4aaff]/30"
        />

        {/* Fast inner fragment ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border-2 border-[#a8d8ff]/50 border-t-transparent border-r-transparent border-b-transparent"
        />

        {/* Core Mass */}
        <motion.div
          animate={{ scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.95),rgba(168,216,255,0.85)_40%,rgba(140,160,255,0.6)_70%,transparent)] shadow-[0_0_30px_rgba(168,216,255,0.7),0_0_60px_rgba(196,170,255,0.5),inset_0_0_20px_rgba(255,255,255,0.6)]"
        >
          {/* Inner volatile singularity */}
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.7, 1.1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffffff_0%,transparent_60%)] blur-[2px]"
          />
        </motion.div>
      </div>
    )
  }

  if (variant === "faded") {
    // Empty state / dormant variant: Very slow, weak pulse
    return (
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`h-16 w-16 shrink-0 rounded-full border border-[#a8d8ff]/10 bg-[radial-gradient(circle_at_35%_35%,rgba(180,200,220,0.3),rgba(120,160,200,0.15)_50%,transparent)] shadow-[0_0_20px_rgba(168,216,255,0.1)] ${className}`}
      />
    )
  }

  // Default: "floating" (Used in Upload/Download zones)
  return (
    <div
      className={`relative flex h-24 w-24 items-center justify-center ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -12, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-16 w-16 items-center justify-center"
      >
        {/* Core */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            filter: ["blur(2px)", "blur(4px)", "blur(2px)"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(168,216,255,0.9))] shadow-[0_0_24px_rgba(168,216,255,0.8),0_0_48px_#c4aaff]"
        >
          {/* Intense center spot */}
          <div className="h-4 w-4 rounded-full bg-white blur-[1px]" />
        </motion.div>

        {/* Dual Orbiting Rings for depth */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0 rounded-full border border-[#a8d8ff] opacity-60"
          style={{
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-[#c4aaff] opacity-40"
          style={{
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
          }}
        />
      </motion.div>
    </div>
  )
}
