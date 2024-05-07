-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "ns" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);
