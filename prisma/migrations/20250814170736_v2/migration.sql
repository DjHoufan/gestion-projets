-- AlterTable
ALTER TABLE "public"."Member" ALTER COLUMN "projectId" SET DEFAULT 'a4b4f6db-5e90-4d05-9be3-f9acd08f1660';

-- CreateTable
CREATE TABLE "public"."_AccompanimentMedia" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AccompanimentMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AccompanimentMedia_B_index" ON "public"."_AccompanimentMedia"("B");

-- AddForeignKey
ALTER TABLE "public"."_AccompanimentMedia" ADD CONSTRAINT "_AccompanimentMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Accompaniment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AccompanimentMedia" ADD CONSTRAINT "_AccompanimentMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
