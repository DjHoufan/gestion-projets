/*
  Warnings:

  - You are about to drop the column `date` on the `Rencontre` table. All the data in the column will be lost.
  - You are about to drop the column `lieu` on the `Rencontre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rencontre" DROP COLUMN "date",
DROP COLUMN "lieu",
ADD COLUMN     "planningId" UUID NOT NULL DEFAULT '5874ecdd-6a80-4374-a956-d95c70c7b5cd';

-- AddForeignKey
ALTER TABLE "Rencontre" ADD CONSTRAINT "Rencontre_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "Planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
