-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_groupId_fkey";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
