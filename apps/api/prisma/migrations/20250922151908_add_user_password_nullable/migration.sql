-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
