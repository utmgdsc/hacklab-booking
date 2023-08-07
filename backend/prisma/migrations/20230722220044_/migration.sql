-- CreateTable
CREATE TABLE "_RoomApprover" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomApprover_AB_unique" ON "_RoomApprover"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomApprover_B_index" ON "_RoomApprover"("B");

-- AddForeignKey
ALTER TABLE "_RoomApprover" ADD CONSTRAINT "_RoomApprover_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("roomName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomApprover" ADD CONSTRAINT "_RoomApprover_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("utorid") ON DELETE CASCADE ON UPDATE CASCADE;
