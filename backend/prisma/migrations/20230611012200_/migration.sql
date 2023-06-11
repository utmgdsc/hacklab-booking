-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('system', 'light', 'dark');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('student', 'admin', 'approver', 'tcard');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'denied', 'cancelled', 'needTCard', 'completed');

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "utorid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AccountRole" NOT NULL DEFAULT 'student',
    "theme" "Theme" NOT NULL DEFAULT 'system',

    CONSTRAINT "User_pkey" PRIMARY KEY ("utorid")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "groupId" INTEGER NOT NULL,
    "authorUtorid" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomName" TEXT NOT NULL,
    "friendlyName" TEXT NOT NULL,
    "capacity" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomName")
);

-- CreateTable
CREATE TABLE "_Approvers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Members" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Invited" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Managers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RoomAccess" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Approvers_AB_unique" ON "_Approvers"("A", "B");

-- CreateIndex
CREATE INDEX "_Approvers_B_index" ON "_Approvers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Members_AB_unique" ON "_Members"("A", "B");

-- CreateIndex
CREATE INDEX "_Members_B_index" ON "_Members"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Invited_AB_unique" ON "_Invited"("A", "B");

-- CreateIndex
CREATE INDEX "_Invited_B_index" ON "_Invited"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Managers_AB_unique" ON "_Managers"("A", "B");

-- CreateIndex
CREATE INDEX "_Managers_B_index" ON "_Managers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomAccess_AB_unique" ON "_RoomAccess"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomAccess_B_index" ON "_RoomAccess"("B");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_authorUtorid_fkey" FOREIGN KEY ("authorUtorid") REFERENCES "User"("utorid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("roomName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Approvers" ADD CONSTRAINT "_Approvers_A_fkey" FOREIGN KEY ("A") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Approvers" ADD CONSTRAINT "_Approvers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited" ADD CONSTRAINT "_Invited_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited" ADD CONSTRAINT "_Invited_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Managers" ADD CONSTRAINT "_Managers_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Managers" ADD CONSTRAINT "_Managers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomAccess" ADD CONSTRAINT "_RoomAccess_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("roomName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomAccess" ADD CONSTRAINT "_RoomAccess_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;
