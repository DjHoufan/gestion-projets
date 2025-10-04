-- DropForeignKey
ALTER TABLE "Accompaniment" DROP CONSTRAINT "Accompaniment_fileId_fkey";

-- AlterTable
ALTER TABLE "Accompaniment" ALTER COLUMN "fileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Accompaniment" ADD CONSTRAINT "Accompaniment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
