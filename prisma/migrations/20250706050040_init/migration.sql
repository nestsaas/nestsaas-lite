-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'S3', 'R2');

-- CreateEnum
CREATE TYPE "AudienceStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('pending', 'active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "last_login" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "website" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "medias" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "url" TEXT NOT NULL,
    "storageProvider" "StorageProvider" NOT NULL DEFAULT 'LOCAL',
    "storageKey" TEXT NOT NULL,
    "title" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "blurhash" TEXT,
    "dominantColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "categorySlug" TEXT,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "media_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "media_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiences" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "status" "AudienceStatus" NOT NULL DEFAULT 'SUBSCRIBED',
    "source" TEXT DEFAULT 'website',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL DEFAULT '',
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "stripePaymentIntentId" TEXT,
    "stripePriceId" TEXT,
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "description" TEXT,
    "interval" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToMediaTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MediaToMediaTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeSubscriptionId_key" ON "users"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "medias_userId_idx" ON "medias"("userId");

-- CreateIndex
CREATE INDEX "medias_mimeType_idx" ON "medias"("mimeType");

-- CreateIndex
CREATE INDEX "medias_createdAt_idx" ON "medias"("createdAt");

-- CreateIndex
CREATE INDEX "medias_categorySlug_idx" ON "medias"("categorySlug");

-- CreateIndex
CREATE UNIQUE INDEX "media_categories_name_key" ON "media_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "media_categories_slug_key" ON "media_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "media_tags_name_key" ON "media_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "media_tags_slug_key" ON "media_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "audiences_email_key" ON "audiences"("email");

-- CreateIndex
CREATE INDEX "audiences_email_idx" ON "audiences"("email");

-- CreateIndex
CREATE INDEX "audiences_status_idx" ON "audiences"("status");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripePaymentIntentId_key" ON "purchases"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripeSessionId_key" ON "purchases"("stripeSessionId");

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_product_idx" ON "purchases"("product");

-- CreateIndex
CREATE INDEX "purchases_status_idx" ON "purchases"("status");

-- CreateIndex
CREATE INDEX "purchases_createdAt_idx" ON "purchases"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_service_key" ON "subscriptions"("userId", "service");

-- CreateIndex
CREATE INDEX "_MediaToMediaTag_B_index" ON "_MediaToMediaTag"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "media_categories"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaTag" ADD CONSTRAINT "_MediaToMediaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaTag" ADD CONSTRAINT "_MediaToMediaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "media_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
