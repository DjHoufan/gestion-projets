-- AlterTable
ALTER TABLE "public"."_AccompanimentMedia" ADD CONSTRAINT "_AccompanimentMedia_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_AccompanimentMedia_AB_unique";

-- CreateTable
CREATE TABLE "public"."akis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "akis_pkey" PRIMARY KEY ("id")
);
