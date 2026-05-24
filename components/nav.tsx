"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Wisp } from "./wisp"

export function Nav() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName =
    user?.fullName || user?.firstName || user?.username || "Traveler"

  return (
    <nav className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[rgba(7,11,24,0.6)] px-6 py-4 backdrop-blur-xl">
      {/* Brand */}
      <Link href="/dashboard" className="group flex items-center gap-3">
        <Wisp
          variant="mini"
          className="group-hover:shadow-[0_0_20px_rgba(168,216,255,0.6)]"
        />
        <span className="font-heading text-[1rem] font-semibold tracking-[0.2em] text-[#c8e8ff]">
          WISP
        </span>
      </Link>
      {/* User menu */}
      {isSignedIn && user && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all duration-200",
              menuOpen
                ? "border-wisp/20 bg-wisp/10"
                : "border-white/10 bg-white/5"
            )}
          >
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={displayName ?? "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-wisp/20 font-heading text-[0.65rem] text-wisp">
                {(displayName ?? "?")[0].toUpperCase()}
              </div>
            )}
            <span className="hidden max-w-30 truncate text-[0.8rem] text-white/80 sm:block">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "text-wisp/50 transition-transform duration-200",
                menuOpen && "rotate-180"
              )}
            />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 z-20 mt-2 w-50 overflow-hidden rounded-xl border border-white/10 bg-[rgba(12,16,32,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-[20px]">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="mb-0.5 font-heading text-[0.75rem] tracking-widest text-wisp/50 uppercase">
                    Signed in as
                  </p>
                  <p className="truncate text-[0.82rem] text-[#c8c4e8]">
                    {displayName}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-[0.82rem] text-[rgba(200,180,180,0.8)] transition-colors duration-150 hover:bg-[rgba(255,100,100,0.07)] hover:text-[#f08888]"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
