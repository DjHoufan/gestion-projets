-- AlterTable
ALTER TABLE "public"."Member" ADD COLUMN     "projectId" UUID NOT NULL DEFAULT 'a4b4f6db-5e90-4d05-9be3-f9acd08f1660';

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
