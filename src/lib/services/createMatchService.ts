import { PouleOpponents, Match } from '@prisma/client';
import { parseISO, endOfDay, addHours } from 'date-fns';

import prisma from '@/lib/prisma';

export async function handleFindOpponentById(
  pouleOpponentId: number
): Promise<PouleOpponents | null> {
  return prisma.pouleOpponents.findUnique({
    where: { id: pouleOpponentId },
  });
}

export async function createMatch(
  pouleOpponentId: number,
  date: string
): Promise<Match> {
  //This code section below is written to also work in production on vercel, which is given in UTC timezone.
  //As the user in production is in UTC timezone , we need to add hours to the date to make it work in CET.
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('User timezone:', userTimezone);

  let matchDate = endOfDay(parseISO(date));

  if (userTimezone === 'UTC') {
    matchDate = addHours(matchDate, 12);
  }

  return prisma.match.create({
    data: {
      pouleOpponentId,
      date: matchDate,
      createdAt: new Date(),
    },
  });
}
