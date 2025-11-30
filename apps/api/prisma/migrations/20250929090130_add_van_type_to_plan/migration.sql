/*
  Warnings:

  - Changed the type of `subscription` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "vanType" TEXT NOT NULL DEFAULT 'VanType1';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscription",
ADD COLUMN     "subscription" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Plan_userId_idx" ON "Plan"("userId");

-- CreateIndex
CREATE INDEX "Plan_vanType_idx" ON "Plan"("vanType");
