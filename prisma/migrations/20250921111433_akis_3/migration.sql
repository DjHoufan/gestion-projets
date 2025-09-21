/*
  Warnings:

  - You are about to drop the column `planningId` on the `Rencontre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rencontre" DROP CONSTRAINT "Rencontre_planningId_fkey";

-- AlterTable
ALTER TABLE "Rencontre" DROP COLUMN "planningId",
ADD COLUMN     "visitId" UUID NOT NULL DEFAULT '0edd8c57-40f4-4bea-b1dc-731363f1d56e';

-- AddForeignKey
ALTER TABLE "Rencontre" ADD CONSTRAINT "Rencontre_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
