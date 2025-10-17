/*
  Warnings:

  - Added the required column `description` to the `Signalement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Signalement" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
