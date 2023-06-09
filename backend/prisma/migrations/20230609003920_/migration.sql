/*
  Warnings:

  - You are about to drop the column `approverUtorid` on the `Request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_approverUtorid_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "approverUtorid";

-- CreateTable
CREATE TABLE "_Approvers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Approvers_AB_unique" ON "_Approvers"("A", "B");

-- CreateIndex
CREATE INDEX "_Approvers_B_index" ON "_Approvers"("B");

-- AddForeignKey
ALTER TABLE "_Approvers" ADD CONSTRAINT "_Approvers_A_fkey" FOREIGN KEY ("A") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Approvers" ADD CONSTRAINT "_Approvers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;
