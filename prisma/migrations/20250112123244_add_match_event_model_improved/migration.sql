/*
  Warnings:

  - You are about to drop the column `description` on the `MatchEvent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MatchEvent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_userId_fkey";

-- AlterTable
ALTER TABLE "MatchEvent" DROP COLUMN "description",
DROP COLUMN "userId",
ADD COLUMN     "assistingUserId" INTEGER,
ADD COLUMN     "goalScorerId" INTEGER,
ADD COLUMN     "playerInId" INTEGER,
ADD COLUMN     "playerOutId" INTEGER;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_goalScorerId_fkey" FOREIGN KEY ("goalScorerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_assistingUserId_fkey" FOREIGN KEY ("assistingUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_playerInId_fkey" FOREIGN KEY ("playerInId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_playerOutId_fkey" FOREIGN KEY ("playerOutId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
