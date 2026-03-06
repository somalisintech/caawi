-- AddForeignKey
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
