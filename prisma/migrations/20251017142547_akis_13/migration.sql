/*
  Warnings:

  - Added the required column `supId` to the `Signalement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Signalement" ADD COLUMN     "supId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_supId_fkey" FOREIGN KEY ("supId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
