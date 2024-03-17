/*
  Warnings:

  - You are about to drop the column `companyId` on the `Occupation` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Occupation" DROP CONSTRAINT "Occupation_companyId_fkey";

-- AlterTable
ALTER TABLE "Occupation" DROP COLUMN "companyId" CASCADE,
ADD COLUMN     "company" TEXT;

-- DropTable
DROP TABLE "Company" CASCADE;
