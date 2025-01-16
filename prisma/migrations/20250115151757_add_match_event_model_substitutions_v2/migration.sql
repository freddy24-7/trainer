/*
  Warnings:

  - You are about to drop the column `assistingUserId` on the `MatchEvent` table. All the data in the column will be lost.
  - You are about to drop the column `goalScorerId` on the `MatchEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchEvent" DROP COLUMN "assistingUserId",
DROP COLUMN "goalScorerId";
