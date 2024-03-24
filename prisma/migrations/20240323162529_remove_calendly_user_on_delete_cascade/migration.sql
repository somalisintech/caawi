-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_calendlyUserUri_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_calendlyUserUri_fkey" FOREIGN KEY ("calendlyUserUri") REFERENCES "CalendlyUser"("uri") ON DELETE SET NULL ON UPDATE CASCADE;
