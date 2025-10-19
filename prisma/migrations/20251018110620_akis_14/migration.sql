-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "eventsId" UUID;

-- CreateTable
CREATE TABLE "Events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titre" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_eventsId_fkey" FOREIGN KEY ("eventsId") REFERENCES "Events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
