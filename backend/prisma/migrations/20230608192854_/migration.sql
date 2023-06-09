/*
  Warnings:

  - You are about to drop the column `roomId` on the `Request` table. All the data in the column will be lost.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Room` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_roomId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "roomId",
ADD COLUMN     "roomName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("roomName");

-- CreateTable
CREATE TABLE "_RoomAccess" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomAccess_AB_unique" ON "_RoomAccess"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomAccess_B_index" ON "_RoomAccess"("B");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("roomName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomAccess" ADD CONSTRAINT "_RoomAccess_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("roomName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomAccess" ADD CONSTRAINT "_RoomAccess_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;
