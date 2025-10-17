/*
  Warnings:

  - You are about to drop the column `Statuts` on the `Signalement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Signalement" DROP COLUMN "Statuts",
ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'En cours';
