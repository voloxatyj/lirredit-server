/*
  Warnings:

  - You are about to drop the column `points` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `voteStatus` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `updoots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "updoots" DROP CONSTRAINT "updoots_post_id_fkey";

-- DropForeignKey
ALTER TABLE "updoots" DROP CONSTRAINT "updoots_user_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "points";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "points",
DROP COLUMN "voteStatus";

-- DropTable
DROP TABLE "updoots";
