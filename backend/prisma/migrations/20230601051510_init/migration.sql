/*
  Warnings:

  - The values [need_tcard] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `end_date` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `friendly_name` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `room_name` on the `Room` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendlyName` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('pending', 'denied', 'cancelled', 'needTCard', 'completed');
ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "friendly_name",
DROP COLUMN "room_name",
ADD COLUMN     "friendlyName" TEXT NOT NULL,
ADD COLUMN     "roomName" TEXT NOT NULL;
