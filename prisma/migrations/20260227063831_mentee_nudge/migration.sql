-- AlterTable
ALTER TABLE "MentorshipRequest" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "MenteeNudge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentorProfileId" UUID NOT NULL,
    "menteeProfileId" UUID NOT NULL,
    "lastNudgedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenteeNudge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenteeNudge_mentorProfileId_menteeProfileId_key" ON "MenteeNudge"("mentorProfileId", "menteeProfileId");

-- AddForeignKey
ALTER TABLE "MenteeNudge" ADD CONSTRAINT "MenteeNudge_mentorProfileId_fkey" FOREIGN KEY ("mentorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeNudge" ADD CONSTRAINT "MenteeNudge_menteeProfileId_fkey" FOREIGN KEY ("menteeProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
