-- AlterTable
ALTER TABLE "PurchaseItems" ADD COLUMN     "facture" TEXT NOT NULL DEFAULT 'd';

-- AlterTable
ALTER TABLE "Rencontre" ALTER COLUMN "visitId" DROP DEFAULT;
