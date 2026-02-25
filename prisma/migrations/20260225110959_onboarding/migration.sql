/*
  Warnings:

  - You are about to drop the column `mentorProfileId` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "mentorProfileId",
ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "_ProfileSkills" ADD CONSTRAINT "_ProfileSkills_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProfileSkills_AB_unique";
