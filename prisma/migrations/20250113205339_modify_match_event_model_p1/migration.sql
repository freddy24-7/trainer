/*
  Warnings:

  - Added the required column `trainingMatch` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_pouleOpponentId_fkey";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "opponentName" TEXT,
ADD COLUMN     "trainingMatch" BOOLEAN NOT NULL,
ALTER COLUMN "pouleOpponentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_pouleOpponentId_fkey" FOREIGN KEY ("pouleOpponentId") REFERENCES "PouleOpponents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
