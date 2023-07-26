/*
  Warnings:

  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `webhooks` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_utorid_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordWebhook" TEXT,
ADD COLUMN     "slackWebhook" TEXT,
ADD COLUMN     "webhooks" JSONB NOT NULL;

-- DropTable
DROP TABLE "Webhook";

-- DropEnum
DROP TYPE "WebhookEvent";

-- DropEnum
DROP TYPE "WebhookType";
