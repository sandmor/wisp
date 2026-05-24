import { clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import {
  AdminWispsTable,
  type AdminWispRow,
} from "@/components/admin/admin-wisps-table"
import { Nav } from "@/components/nav"
import { WispBackground } from "@/components/wisp-background"
import {
  getCurrentUserAdminState,
  getUserDisplayName,
  getUserPrimaryEmail,
} from "@/lib/admin"
import { prisma } from "@/lib/db"

const PAGE_SIZE = 20

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { userId, isAdmin } = await getCurrentUserAdminState()

  if (!userId) {
    redirect("/")
  }

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const resolvedSearchParams = await searchParams
  const page = parsePage(resolvedSearchParams.page)
  const skip = (page - 1) * PAGE_SIZE

  const [totalCount, wisps] = await Promise.all([
    prisma.wispFile.count(),
    prisma.wispFile.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
  ])

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const effectivePage = Math.min(page, pageCount)

  if (effectivePage !== page) {
    redirect(`/admin?page=${effectivePage}`)
  }

  const ownerIds = [...new Set(wisps.map((wisp) => wisp.userId))]
  const client = await clerkClient()
  const ownersResponse =
    ownerIds.length > 0
      ? await client.users.getUserList({
          userId: ownerIds,
          limit: ownerIds.length,
        })
      : null
  const owners = ownersResponse?.data ?? []
  const now = new Date()

  const ownersById = new Map(owners.map((owner) => [owner.id, owner]))

  const rows: AdminWispRow[] = wisps.map((wisp) => {
    const owner = ownersById.get(wisp.userId)

    return {
      id: wisp.id,
      slug: wisp.slug,
      originalName: wisp.originalName,
      mimeType: wisp.mimeType,
      size: wisp.size.toString(),
      status: wisp.expiresAt < now ? "EXPIRED" : wisp.status,
      downloadCount: wisp.downloadCount,
      createdAt: wisp.createdAt.toISOString(),
      expiresAt: wisp.expiresAt.toISOString(),
      ownerUserId: wisp.userId,
      ownerName: getUserDisplayName(owner),
      ownerEmail: getUserPrimaryEmail(owner),
    }
  })

  return (
    <div className="relative flex min-h-dvh flex-col">
      <WispBackground />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <Nav />

        <main className="mx-auto w-full max-w-350 flex-1 px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h1 className="font-heading text-[clamp(1rem,3vw,1.3rem)] font-medium tracking-[0.15em] text-wisp">
              Admin Archive
            </h1>
            <p className="mt-1 text-[0.82rem] text-[rgba(140,135,165,0.7)] italic">
              Global visibility across every uploaded wisp and its owner.
            </p>
          </div>

          <AdminWispsTable
            rows={rows}
            page={effectivePage}
            pageCount={pageCount}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
          />
        </main>
      </div>
    </div>
  )
}

function parsePage(value?: string) {
  const page = Number.parseInt(value ?? "1", 10)

  if (!Number.isFinite(page) || page < 1) {
    return 1
  }

  return page
}
