-- CreateEnum
CREATE TYPE "OpponentStrength" AS ENUM ('STRONGER', 'SIMILAR', 'WEAKER');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "opponentStrength" "OpponentStrength";
