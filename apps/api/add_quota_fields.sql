-- Add new columns for PDF export quota tracking
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "reportsUsedThisMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "reportQuotaResetAt" TIMESTAMP(3);

-- Update existing users to set default values
UPDATE "User" 
SET "reportQuotaResetAt" = (NOW() + INTERVAL '1 month')
WHERE "reportQuotaResetAt" IS NULL;
