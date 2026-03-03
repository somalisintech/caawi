-- CreateEnum
CREATE TYPE "MentorshipRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "MentorshipRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "menteeProfileId" UUID NOT NULL,
    "mentorProfileId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MentorshipRequestStatus" NOT NULL DEFAULT 'PENDING',
    "lastNudgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipRequest_menteeProfileId_mentorProfileId_key" ON "MentorshipRequest"("menteeProfileId", "mentorProfileId");

-- AddForeignKey
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_menteeProfileId_fkey" FOREIGN KEY ("menteeProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_mentorProfileId_fkey" FOREIGN KEY ("mentorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
