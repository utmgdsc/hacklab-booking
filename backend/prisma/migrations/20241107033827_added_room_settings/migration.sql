-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "description" TEXT,
ADD COLUMN     "needAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomRules" TEXT;
