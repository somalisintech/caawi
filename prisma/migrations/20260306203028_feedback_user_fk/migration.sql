-- CreateEnum
CREATE TYPE "FeedbackRole" AS ENUM ('MENTOR', 'MENTEE');

-- CreateTable
CREATE TABLE "SessionFeedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "role" "FeedbackRole" NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "windowClosesAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionFeedback_sessionId_idx" ON "SessionFeedback"("sessionId");

-- CreateIndex
CREATE INDEX "SessionFeedback_authorId_idx" ON "SessionFeedback"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionFeedback_sessionId_authorId_key" ON "SessionFeedback"("sessionId", "authorId");

-- AddForeignKey
ALTER TABLE "SessionFeedback" ADD CONSTRAINT "SessionFeedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionFeedback" ADD CONSTRAINT "SessionFeedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
