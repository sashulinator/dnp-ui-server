/*
  Warnings:

  - Added the required column `sourceConfigKeyName` to the `NormalizationConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceConfigKeyName` to the `NormalizationConfigArchive` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NormalizationConfig" ADD COLUMN     "sourceConfigKeyName" VARCHAR(36) NOT NULL DEFAULT 'defaultKeyName';

-- AlterTable
ALTER TABLE "NormalizationConfigArchive" ADD COLUMN     "sourceConfigKeyName" VARCHAR(36) NOT NULL DEFAULT 'defaultKeyName';

-- CreateTable
CREATE TABLE "SourceConfig" (
    "keyName" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "updatedBy" VARCHAR(24) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "SourceConfig_pkey" PRIMARY KEY ("keyName")
);
