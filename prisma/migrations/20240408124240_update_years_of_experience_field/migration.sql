/*
  Warnings:

  - You are about to drop the column `yearsOfExperience` on the `Occupation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role,company]` on the table `Occupation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Occupation_role_company_yearsOfExperience_key";

-- AlterTable
ALTER TABLE "Occupation" DROP COLUMN "yearsOfExperience";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "yearsOfExperience" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Occupation_role_company_key" ON "Occupation"("role", "company");
