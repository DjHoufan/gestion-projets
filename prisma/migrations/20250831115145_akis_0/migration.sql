/*
  Warnings:

  - The primary key for the `_AccompanimentMedia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_AccompanimentMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_classeId_fkey";

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "classeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_AccompanimentMedia" DROP CONSTRAINT "_AccompanimentMedia_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_AccompanimentMedia_AB_unique" ON "_AccompanimentMedia"("A", "B");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
