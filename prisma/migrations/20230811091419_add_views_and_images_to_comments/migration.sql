-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "views" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "pictures" ADD COLUMN     "commentsId" INTEGER;

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
