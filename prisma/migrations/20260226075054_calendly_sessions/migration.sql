-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'CANCELED');

-- AlterTable
ALTER TABLE "CalendlyUser" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "webhookUri" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "calendlyEventUri" TEXT NOT NULL,
    "eventName" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "mentorProfileId" UUID NOT NULL,
    "menteeProfileId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canceledAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_calendlyEventUri_key" ON "Session"("calendlyEventUri");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_mentorProfileId_fkey" FOREIGN KEY ("mentorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_menteeProfileId_fkey" FOREIGN KEY ("menteeProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
