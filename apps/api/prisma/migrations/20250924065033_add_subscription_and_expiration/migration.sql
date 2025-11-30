/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Made the column `userId` on table `Plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO1', 'PRO2', 'PRO3');

-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "role",
ADD COLUMN     "subscription" "SubscriptionType" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
