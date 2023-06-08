/*
  Warnings:

  - You are about to drop the column `approverId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Request` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorUtorid` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('system', 'light', 'dark');

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_approverId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_Invited" DROP CONSTRAINT "_Invited_B_fkey";

-- DropForeignKey
ALTER TABLE "_Managers" DROP CONSTRAINT "_Managers_B_fkey";

-- DropForeignKey
ALTER TABLE "_Members" DROP CONSTRAINT "_Members_B_fkey";

-- DropIndex
DROP INDEX "User_utorid_key";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "approverId",
DROP COLUMN "authorId",
ADD COLUMN     "approverUtorid" TEXT,
ADD COLUMN     "authorUtorid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'system',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("utorid");

-- AlterTable
ALTER TABLE "_Invited" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_Managers" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_Members" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_authorUtorid_fkey" FOREIGN KEY ("authorUtorid") REFERENCES "User"("utorid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_approverUtorid_fkey" FOREIGN KEY ("approverUtorid") REFERENCES "User"("utorid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited" ADD CONSTRAINT "_Invited_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Managers" ADD CONSTRAINT "_Managers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;
