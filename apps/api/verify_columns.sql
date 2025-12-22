-- Vérifier que les colonnes existent
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
AND column_name IN ('reportsUsedThisMonth', 'reportQuotaResetAt')
ORDER BY column_name;
