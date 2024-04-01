/*
  Warnings:

  - A unique constraint covering the columns `[city,country]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role,company,yearsOfExperience]` on the table `Occupation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Location_country_key";

-- DropIndex
DROP INDEX "Occupation_company_key";

-- CreateIndex
CREATE UNIQUE INDEX "Location_city_country_key" ON "Location"("city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Occupation_role_company_yearsOfExperience_key" ON "Occupation"("role", "company", "yearsOfExperience");
