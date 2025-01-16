-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SUBSTITUTION_IN', 'SUBSTITUTION_OUT');

-- CreateEnum
CREATE TYPE "SubstitutionReason" AS ENUM ('TACTICAL', 'FITNESS', 'INJURY', 'OTHER');

-- CreateTable
CREATE TABLE "MatchEvent" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "goalScorerId" INTEGER,
    "assistingUserId" INTEGER,
    "playerInId" INTEGER,
    "playerOutId" INTEGER,
    "minute" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL,
    "substitutionReason" "SubstitutionReason",

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_playerInId_fkey" FOREIGN KEY ("playerInId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_playerOutId_fkey" FOREIGN KEY ("playerOutId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
