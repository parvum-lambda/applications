-- CreateTable
CREATE TABLE "ApplicationIdentifier" (
    "id" UUID NOT NULL DEFAULT generate_uuid7(),
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "ApplicationIdentifier_pkey" PRIMARY KEY ("id")
);
