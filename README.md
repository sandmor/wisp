# Wisp

**Ephemeral file transfer, carried on the wind.**

Wisp is a self-hostable file transfer service built with Next.js, Clerk, Prisma, PostgreSQL, and S3-compatible storage. Upload a file, get a shareable link and QR code, and let it expire on a fixed TTL.

## Features

- Sign in with Google through Clerk SSO
- Upload directly to S3-compatible storage with presigned PUT URLs
- Pick from fixed TTL options for each upload
- Share a public download page and QR code for every file
- Generate short-lived presigned download URLs on demand
- Let owners delete their own files from the dashboard
- Restrict `/admin` to a single Clerk email address via `ADMIN_EMAIL`
- Compatible with Cloudflare R2, AWS S3, MinIO, Tigris, and any S3-compatible service

## How It Works

1. A signed-in user opens the dashboard and chooses a TTL.
2. The browser calls `POST /api/files` to create a pending record and receive a presigned PUT URL.
3. The browser uploads the file directly to S3, then calls `PATCH /api/files/:id/confirm` to mark the record active.
4. Recipients open `/d/:slug`, which loads the public download page and redirects to a short-lived presigned GET URL.
5. The owner can delete the file from the dashboard; the server removes the S3 object first and then deletes the database row.
6. A cron job calls `GET /api/cleanup` every hour to remove expired files that were never manually deleted.

Expired files are marked in the database when they are accessed past their TTL, but the S3 object is only removed when the cleanup route runs or the owner deletes the file manually.

---

## Quick Start

### 1. Install dependencies

This repo uses Bun. The lockfile is `bun.lock`, and Prisma client generation runs automatically in `prepare`.

```bash
bun install
```

### 2. Create your environment file

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local` before starting the app.

### 3. Set up the database

Run Prisma migrations against your local PostgreSQL database:

```bash
bun --bun run prisma migrate dev
```

If you are only syncing the schema during local development, you can use:

```bash
bun --bun run prisma db push
```

### 4. Run the app

```bash
bun run dev
```

Open http://localhost:3000.

---

### Scripts

- `bun run dev` starts the Next.js dev server with Turbopack
- `bun run build` builds the production app
- `bun run start` starts the production server
- `bun run lint` runs ESLint
- `bun run typecheck` runs TypeScript without emitting files
- `bun run format` formats `ts` and `tsx` files with Prettier

## Environment Variables

| Variable                            | Required | Notes                                                                       |
| ----------------------------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`                      | ✅       | PostgreSQL connection string used by Prisma                                 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅       | Clerk publishable key for the browser                                       |
| `CLERK_SECRET_KEY`                  | ✅       | Clerk secret key for server-side auth                                       |
| `NEXT_PUBLIC_APP_URL`               | ✅       | Public base URL used in share links and metadata                            |
| `ADMIN_EMAIL`                       |          | Exact email address allowed to access `/admin`                              |
| `CLEANUP_SECRET`                    |          | Shared secret for calls to the cleanup route                                |
| `S3_ENDPOINT`                       | ✅       | S3-compatible endpoint URL                                                  |
| `S3_REGION`                         | ✅       | Use `auto` for R2; many providers use `us-east-1`                           |
| `S3_BUCKET_NAME`                    | ✅       | Bucket name for uploads                                                     |
| `S3_ACCESS_KEY_ID`                  | ✅       | S3 access key                                                               |
| `S3_SECRET_ACCESS_KEY`              | ✅       | S3 secret key                                                               |
| `S3_FORCE_PATH_STYLE`               |          | Set `true` for MinIO or other path-style endpoints                          |
| `MAX_FILE_SIZE_MB`                  |          | Non-admin upload limit, default `500`                                       |
| `TTL_OPTIONS_HOURS`                 |          | Comma-separated TTL values allowed in the uploader, default `1,6,24,72,168` |

---

## Authentication Setup

Wisp uses Clerk for authentication. Create a Clerk application, enable Google SSO in the Clerk dashboard, then copy the publishable and secret keys into your environment file.

The login flow redirects through `/sso-callback`, so that route must remain available in the app.

If you want admin access, set `ADMIN_EMAIL` to the exact email address of the Clerk user who should see `/admin`.

## Storage Setup

### Cloudflare R2

1. Create a bucket and API token with object read/write permissions.
2. Set `S3_ENDPOINT` to `https://<account-id>.r2.cloudflarestorage.com`.
3. Set `S3_REGION=auto`.
4. Allow CORS for your app origin with `PUT` and `GET`.

### AWS S3

1. Create a bucket and an IAM user with `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` on that bucket.
2. Set `S3_ENDPOINT` to your regional S3 endpoint.
3. Allow CORS for your app origin with `PUT` and `GET`.

### MinIO

1. Set `S3_ENDPOINT=http://localhost:9000`.
2. Set `S3_FORCE_PATH_STYLE=true`.
3. Set `S3_REGION=us-east-1`.

---

## Architecture

```text
Browser
  │
  ├─ POST /api/files
  │     Creates a pending DB record and returns a presigned PUT URL
  │
  ├─ PUT <presigned-url>
  │     Browser uploads directly to S3
  │
  ├─ PATCH /api/files/:id/confirm
  │     Marks the file ACTIVE in the database
  │
  ├─ GET /d/:slug
  │     Public download page with no auth requirement
  │
  ├─ GET /api/files/:id/download
  │     Redirects to a short-lived presigned GET URL
  │
  └─ GET /api/cron/cleanup
        Deletes expired files from S3 and the database
```

## Tech Stack

| Layer        | Technology                   |
| ------------ | ---------------------------- |
| Framework    | Next.js 16.1.7 (App Router)  |
| Auth         | Clerk                        |
| Database ORM | Prisma 7.8.0                 |
| Database     | PostgreSQL                   |
| Storage      | S3-compatible storage        |
| UI           | Tailwind CSS 4 and shadcn/ui |
| Motion       | Framer Motion                |

---

## Automatic Expiry Cleanup (optional)

Wisp marks files as `EXPIRED` in the database when they're accessed past their TTL, but requires to be triggered to delete S3 objects. To make this process automatic it is recommended to use a cron job calling the endpoint

```bash
# Example: delete expired files from S3 and DB
curl -X POST https://your-wisp.com/api/cleanup \
  -H "Authorization: Bearer $CLEANUP_SECRET"
```

---

## License

MIT
