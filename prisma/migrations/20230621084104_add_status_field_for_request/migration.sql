-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'FULFILLED', 'REJECTED', 'WAITING');

-- AlterTable
ALTER TABLE "follows" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'WAITING';
