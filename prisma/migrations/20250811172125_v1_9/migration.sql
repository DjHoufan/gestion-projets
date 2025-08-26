-- AlterTable
ALTER TABLE "public"."Member" ALTER COLUMN "projectId" SET DEFAULT 'a4b4f6db-5e90-4d05-9be3-f9acd08f1660';

-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "local" DROP DEFAULT;
