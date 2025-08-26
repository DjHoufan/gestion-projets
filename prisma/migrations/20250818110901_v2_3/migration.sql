/*
  Warnings:

  - The primary key for the `_AccompanimentMedia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_AccompanimentMedia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classeId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "classeId" UUID NOT NULL,
ALTER COLUMN "projectId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "_AccompanimentMedia" DROP CONSTRAINT "_AccompanimentMedia_AB_pkey";

-- CreateTable
CREATE TABLE "Classe" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "usersId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccompanimentMedia_AB_unique" ON "_AccompanimentMedia"("A", "B");

-- AddForeignKey
ALTER TABLE "Classe" ADD CONSTRAINT "Classe_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
