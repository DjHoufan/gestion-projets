/*
  Warnings:

  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Member" ALTER COLUMN "projectId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "read";
