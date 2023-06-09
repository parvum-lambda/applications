/*
  Warnings:

  - Added the required column `lastEventId` to the `Applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applications" ADD COLUMN     "lastEventId" UUID NOT NULL;
