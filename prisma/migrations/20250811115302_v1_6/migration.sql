/*
  Warnings:

  - You are about to drop the column `projectId` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Member" DROP COLUMN "projectId";
