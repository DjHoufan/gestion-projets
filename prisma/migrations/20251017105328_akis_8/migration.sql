-- CreateTable
CREATE TABLE "Signalement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "Statuts" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "groupeId" UUID NOT NULL,

    CONSTRAINT "Signalement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Accompaniment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
