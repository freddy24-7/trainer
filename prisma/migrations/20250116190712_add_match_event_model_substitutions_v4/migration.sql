/*
  Warnings:

  - You are about to drop the `MatchEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_playerInId_fkey";

-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_playerOutId_fkey";

-- DropTable
DROP TABLE "MatchEvent";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "SubstitutionReason";
