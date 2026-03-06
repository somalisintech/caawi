/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,authorId,type]` on the table `SessionNote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SessionNote_sessionId_authorId_type_key" ON "SessionNote"("sessionId", "authorId", "type");
