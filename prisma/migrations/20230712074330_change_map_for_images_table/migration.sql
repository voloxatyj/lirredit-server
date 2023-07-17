/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_post_id_fkey";

-- DropTable
DROP TABLE "images";

-- CreateTable
CREATE TABLE "pictures" (
    "id" SERIAL NOT NULL,
    "secure_url" VARCHAR NOT NULL,
    "public_id" VARCHAR NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pictures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pictures_id_key" ON "pictures"("id");

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
