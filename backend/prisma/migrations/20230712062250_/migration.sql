/*
  Warnings:

  - You are about to drop the column `webhooks` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WebhookType" AS ENUM ('discord', 'slack', 'email');

-- CreateEnum
CREATE TYPE "WebhookEvent" AS ENUM ('booking_created', 'booking_approval_requested', 'booking_updated', 'booking_deleted', 'booking_approved', 'booking_rejected', 'booking_cancelled', 'room_access_granted', 'room_access_revoked', 'group_member_invited', 'group_member_joined', 'group_member_removed', 'group_member_left');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "webhooks";

-- CreateTable
CREATE TABLE "Webhook" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "utorid" TEXT NOT NULL,
    "type" "WebhookType" NOT NULL,
    "events" "WebhookEvent"[],

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_utorid_fkey" FOREIGN KEY ("utorid") REFERENCES "User"("utorid") ON DELETE RESTRICT ON UPDATE CASCADE;
