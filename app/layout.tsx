import { Philosopher, Alegreya_Sans, Alegreya } from "next/font/google"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"], // Explicit weights for headings/logos
  variable: "--font-heading",
})

const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Explicit weights for UI elements
  variable: "--font-sans",
})

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-serif", // Alegreya is a variable font, no weights needed
})

export const metadata: Metadata = {
  title: {
    default: "Wisp — Ephemeral File Transfer",
    template: "%s — Wisp",
  },
  description:
    "Send files across devices like a whisper. Upload once, share instantly, gone when the moment passes.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      process.env.NEXTAUTH_URL ??
      "http://localhost:3000"
  ),
  openGraph: {
    title: "Wisp",
    description: "Ephemeral file transfer, carried on the wind.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        philosopher.variable,
        alegreyaSans.variable,
        alegreya.variable,
        "font-serif" // Sets Alegreya as the default body font
      )}
    >
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}
