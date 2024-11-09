/*
  Warnings:

  - You are about to drop the column `needAccess` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "needAccess",
ADD COLUMN     "needTCardAccess" BOOLEAN NOT NULL DEFAULT false;
