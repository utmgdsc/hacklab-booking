/*
  Warnings:

  - You are about to drop the `Requset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Requset" DROP CONSTRAINT "Requset_approverId_fkey";

-- DropForeignKey
ALTER TABLE "Requset" DROP CONSTRAINT "Requset_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Requset" DROP CONSTRAINT "Requset_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Requset" DROP CONSTRAINT "Requset_roomId_fkey";

-- DropTable
DROP TABLE "Requset";

-- CreateTable
CREATE TABLE "Request" (
    "id" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "groupId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "approverId" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
