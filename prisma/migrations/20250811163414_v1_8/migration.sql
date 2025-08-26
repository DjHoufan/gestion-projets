/*
  Warnings:

  - Added the required column `fileId` to the `Accompaniment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Accompaniment" ADD COLUMN     "fileId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."Member" ALTER COLUMN "projectId" SET DEFAULT 'a4b4f6db-5e90-4d05-9be3-f9acd08f1660';

-- AddForeignKey
ALTER TABLE "public"."Accompaniment" ADD CONSTRAINT "Accompaniment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
