-- AlterTable
ALTER TABLE "NormalizationConfig" ALTER COLUMN "sourceConfigKeyName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "NormalizationConfigArchive" ALTER COLUMN "sourceConfigKeyName" DROP DEFAULT;
