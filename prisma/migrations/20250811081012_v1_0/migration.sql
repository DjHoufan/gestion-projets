/*
  Warnings:

  - You are about to drop the column `center` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `formation` on the `Member` table. All the data in the column will be lost.
  - Added the required column `attestation` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Member" DROP COLUMN "center",
DROP COLUMN "formation",
ADD COLUMN     "attestation" TEXT NOT NULL;
