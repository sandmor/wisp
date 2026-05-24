-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "WispFile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WispFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WispFile_slug_key" ON "WispFile"("slug");

-- CreateIndex
CREATE INDEX "WispFile_userId_idx" ON "WispFile"("userId");

-- CreateIndex
CREATE INDEX "WispFile_slug_idx" ON "WispFile"("slug");

-- CreateIndex
CREATE INDEX "WispFile_expiresAt_idx" ON "WispFile"("expiresAt");
