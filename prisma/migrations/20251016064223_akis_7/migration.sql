-- AlterEnum
ALTER TYPE "Type" ADD VALUE 'superviseur';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "supervisorId" UUID;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
