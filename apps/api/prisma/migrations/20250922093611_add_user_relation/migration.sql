/*
  Warnings:

  - Made the column `userId` on table `Plan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
