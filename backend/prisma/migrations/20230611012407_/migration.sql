/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `groupId` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_Approvers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_Invited` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_Managers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_Members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_groupId_fkey";

-- DropForeignKey
ALTER TABLE "_Approvers" DROP CONSTRAINT "_Approvers_A_fkey";

-- DropForeignKey
ALTER TABLE "_Invited" DROP CONSTRAINT "_Invited_A_fkey";

-- DropForeignKey
ALTER TABLE "_Managers" DROP CONSTRAINT "_Managers_A_fkey";

-- DropForeignKey
ALTER TABLE "_Members" DROP CONSTRAINT "_Members_A_fkey";

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Request" DROP CONSTRAINT "Request_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "groupId",
ADD COLUMN     "groupId" UUID NOT NULL,
ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_Approvers" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL;

-- AlterTable
ALTER TABLE "_Invited" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL;

-- AlterTable
ALTER TABLE "_Managers" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL;

-- AlterTable
ALTER TABLE "_Members" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_Approvers_AB_unique" ON "_Approvers"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_Invited_AB_unique" ON "_Invited"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_Managers_AB_unique" ON "_Managers"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_Members_AB_unique" ON "_Members"("A", "B");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Approvers" ADD CONSTRAINT "_Approvers_A_fkey" FOREIGN KEY ("A") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited" ADD CONSTRAINT "_Invited_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Managers" ADD CONSTRAINT "_Managers_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
