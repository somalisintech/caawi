/*
  Warnings:

  - A unique constraint covering the columns `[calendlyUserUri]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "calendlyUserUri" TEXT;

-- CreateTable
CREATE TABLE "CalendlyUser" (
    "uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "scheduling_url" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_organization" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,

    CONSTRAINT "CalendlyUser_pkey" PRIMARY KEY ("uri")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_calendlyUserUri_key" ON "Profile"("calendlyUserUri");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_calendlyUserUri_fkey" FOREIGN KEY ("calendlyUserUri") REFERENCES "CalendlyUser"("uri") ON DELETE CASCADE ON UPDATE CASCADE;
