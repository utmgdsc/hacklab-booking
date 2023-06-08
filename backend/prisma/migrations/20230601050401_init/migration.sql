-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('student', 'admin', 'approver', 'tcard');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'denied', 'cancelled', 'need_tcard', 'completed');

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "utorid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AccountRole" NOT NULL DEFAULT 'student',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requset" (
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

    CONSTRAINT "Requset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL,
    "room_name" TEXT NOT NULL,
    "friendly_name" TEXT NOT NULL,
    "capacity" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Members" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Invited" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Managers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_utorid_key" ON "User"("utorid");

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

-- AddForeignKey
ALTER TABLE "Requset" ADD CONSTRAINT "Requset_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requset" ADD CONSTRAINT "Requset_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requset" ADD CONSTRAINT "Requset_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requset" ADD CONSTRAINT "Requset_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited" ADD CONSTRAINT "_Invited_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited" ADD CONSTRAINT "_Invited_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Managers" ADD CONSTRAINT "_Managers_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Managers" ADD CONSTRAINT "_Managers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
