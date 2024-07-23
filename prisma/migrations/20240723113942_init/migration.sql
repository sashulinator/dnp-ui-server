-- CreateTable
CREATE TABLE "Process" (
    "id" VARCHAR(24) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "normalizationConfigId" VARCHAR(24) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreConfig" (
    "keyname" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "updatedBy" VARCHAR(24) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "StoreConfig_pkey" PRIMARY KEY ("keyname")
);

-- CreateTable
CREATE TABLE "NormalizationConfig" (
    "id" VARCHAR(24) NOT NULL,
    "name" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "current" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "updatedBy" VARCHAR(24) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "NormalizationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "ns" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_normalizationConfigId_fkey" FOREIGN KEY ("normalizationConfigId") REFERENCES "NormalizationConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
