-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('PRACTICE', 'COMPETITION');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('PLAYING', 'BENCH', 'ABSENT');

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_pouleOpponentId_fkey";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "matchType" "MatchType" NOT NULL DEFAULT 'COMPETITION',
ADD COLUMN     "practiceOpponent" TEXT,
ALTER COLUMN "pouleOpponentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MatchPlayer" ADD COLUMN     "status" "PlayerStatus" NOT NULL DEFAULT 'ABSENT';

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_pouleOpponentId_fkey" FOREIGN KEY ("pouleOpponentId") REFERENCES "PouleOpponents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
