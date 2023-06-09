-- CreateTable
CREATE TABLE "Applications" (
    "id" UUID NOT NULL,
    "name" VARCHAR(75),
    "appId" VARCHAR(255),
    "appKey" VARCHAR(500),
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applications_appId_key" ON "Applications"("appId");

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_id_fkey" FOREIGN KEY ("id") REFERENCES "ApplicationIdentifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
