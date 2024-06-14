-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "ns" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NormalizationConfigArchive" (
    "id" VARCHAR(24) NOT NULL,
    "name" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "updatedBy" VARCHAR(24) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "NormalizationConfigArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NormalizationConfig" (
    "id" VARCHAR(24) NOT NULL,
    "name" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "updatedBy" VARCHAR(24) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "NormalizationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" VARCHAR(24) NOT NULL,
    "createdBy" VARCHAR(24) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "normalizationConfigId" VARCHAR(24) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NormalizationConfig_name_key" ON "NormalizationConfig"("name");
