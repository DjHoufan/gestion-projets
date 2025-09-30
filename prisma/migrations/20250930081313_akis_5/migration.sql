-- DropForeignKey
ALTER TABLE "MessageView" DROP CONSTRAINT "MessageView_userId_fkey";

-- AddForeignKey
ALTER TABLE "MessageView" ADD CONSTRAINT "MessageView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
