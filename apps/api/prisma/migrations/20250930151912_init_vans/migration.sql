/*
  Warnings:

  - You are about to drop the column `vanType` on the `Plan` table. All the data in the column will be lost.
  - Changed the type of `subscription` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."VanType" AS ENUM ('VOLKSWAGEN_ID_BUZZ', 'RENAULT_KANGOO_EXPRESS', 'FIAT_DOBLO', 'MERCEDES_VITO', 'FORD_TRANSIT_CUSTOM_L1', 'RENAULT_MASTER_L2H2', 'CITROEN_JUMPER_L2H2', 'MERCEDES_SPRINTER_L3H2', 'FIAT_DUCATO_L3H2', 'IVECO_DAILY_35S14_L2H2', 'MAN_TGE_L3H2', 'MERCEDES_SPRINTER_L4H2', 'VOLKSWAGEN_CRAFTER_L4H2', 'MERCEDES_SPRINTER_L5H2', 'VOLKSWAGEN_CRAFTER_L5H2', 'RENAULT_MASTER_L3H2', 'CITROEN_JUMPER_L3H2', 'MAN_TGE_L4H2', 'IVECO_DAILY_35S14_L3H2', 'MERCEDES_SPRINTER_L3H2_MINI_BUS', 'VOLKSWAGEN_CRAFTER_L3H2_MINI_BUS');

-- DropIndex
DROP INDEX "public"."Plan_vanType_idx";

-- AlterTable
ALTER TABLE "public"."Plan" DROP COLUMN "vanType";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "subscription",
ADD COLUMN     "subscription" "public"."SubscriptionType" NOT NULL;

-- CreateTable
CREATE TABLE "public"."Van" (
    "id" SERIAL NOT NULL,
    "vanType" "public"."VanType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,

    CONSTRAINT "Van_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanVan" (
    "planId" INTEGER NOT NULL,
    "vanId" INTEGER NOT NULL,

    CONSTRAINT "PlanVan_pkey" PRIMARY KEY ("planId","vanId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Van_vanType_key" ON "public"."Van"("vanType");

-- AddForeignKey
ALTER TABLE "public"."PlanVan" ADD CONSTRAINT "PlanVan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanVan" ADD CONSTRAINT "PlanVan_vanId_fkey" FOREIGN KEY ("vanId") REFERENCES "public"."Van"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
