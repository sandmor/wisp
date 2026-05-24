"use client"

import Link from "next/link"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatBytes } from "@/lib/utils"

export type AdminWispRow = {
  id: string
  slug: string
  originalName: string
  mimeType: string
  size: string
  status: "PENDING" | "ACTIVE" | "EXPIRED"
  downloadCount: number
  createdAt: string
  expiresAt: string
  ownerUserId: string
  ownerName: string
  ownerEmail: string | null
}

type Props = {
  rows: AdminWispRow[]
  page: number
  pageCount: number
  pageSize: number
  totalCount: number
}

const columns: ColumnDef<AdminWispRow>[] = [
  {
    accessorKey: "originalName",
    header: "Wisp",
    cell: ({ row }) => (
      <div className="min-w-56">
        <p className="truncate text-[0.84rem] text-[#e5e1ff]">
          {row.original.originalName}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.7rem] text-white/45">
          <span>{row.original.mimeType}</span>
          <span>·</span>
          <Link
            href={`/d/${row.original.slug}`}
            className="text-wisp/70 transition-colors hover:text-wisp"
          >
            /d/{row.original.slug}
          </Link>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row }) => (
      <div className="min-w-50">
        <p>{row.original.ownerName}</p>
        <p className="mt-1 truncate text-[0.72rem] text-white/45">
          {row.original.ownerEmail ?? "No email address"}
        </p>
        <p className="mt-1 truncate font-mono text-[0.68rem] text-white/30">
          {row.original.ownerUserId}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex rounded-full border px-2 py-1 font-heading text-[0.62rem] tracking-[0.12em] uppercase",
          row.original.status === "ACTIVE" &&
            "border-emerald-300/20 bg-emerald-400/8 text-emerald-200",
          row.original.status === "PENDING" &&
            "border-amber-300/20 bg-amber-400/8 text-amber-200",
          row.original.status === "EXPIRED" &&
            "border-white/10 bg-white/5 text-white/50"
        )}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => formatBytes(BigInt(row.original.size)),
  },
  {
    accessorKey: "downloadCount",
    header: "Downloads",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatTimestamp(row.original.createdAt),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => formatTimestamp(row.original.expiresAt),
  },
]

export function AdminWispsTable({
  rows,
  page,
  pageCount,
  pageSize,
  totalCount,
}: Props) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-[0.68rem] tracking-[0.18em] text-wisp/55 uppercase">
            All wisps
          </h2>
          <p className="mt-1 text-[0.77rem] text-white/45">
            Showing {start}-{end} of {totalCount} wisps
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-40 text-center text-white/40"
              >
                No wisps found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-white/8 px-5 py-4 text-[0.77rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {page} of {pageCount || 1}
        </p>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
          >
            <Link
              href={page > 1 ? `/admin?page=${page - 1}` : `/admin?page=1`}
              aria-disabled={page <= 1}
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
            >
              Previous
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
          >
            <Link
              href={
                page < pageCount
                  ? `/admin?page=${page + 1}`
                  : `/admin?page=${pageCount || 1}`
              }
              aria-disabled={page >= pageCount}
              className={cn(
                (page >= pageCount || pageCount === 0) &&
                  "pointer-events-none opacity-50"
              )}
            >
              Next
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}
