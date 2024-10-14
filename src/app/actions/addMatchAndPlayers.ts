'use server';

// Validation not done here as already done in addMatch and addMatchPlayer

import { ZodIssue } from 'zod';
import addMatch from '@/app/actions/addMatch';
import addMatchPlayer from '@/app/actions/addMatchPlayer';
import { formatError } from '@/utils/errorUtils';

export default async function addMatchAndPlayers(
  _prevState: any,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  const matchResponse = await addMatch(null, params);

  if (matchResponse.errors) {
    return formatError('Failed to create match.', ['form']);
  }

  const { match } = matchResponse;
  const createdMatchId = match?.id;

  if (!createdMatchId) {
    return formatError('Error: Match ID not found.', ['form']);
  }

  const playersString = params.get('players') as string | null;
  if (!playersString) {
    return formatError('Players data is missing.', ['players']);
  }

  let players;
  try {
    players = JSON.parse(playersString);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error parsing players data';
    return formatError(`Invalid player data format: ${errorMessage}`, [
      'players',
    ]);
  }

  if (!Array.isArray(players)) {
    return formatError('Players data is not an array.', ['players']);
  }

  const playerErrors: ZodIssue[] = [];
  for (const player of players) {
    const { id, minutes, available } = player;

    let parsedMinutes = available ? parseInt(minutes, 10) : 0;
    if (isNaN(parsedMinutes)) {
      playerErrors.push(
        ...formatError(`Invalid minutes for player ${id}. Expected a number.`, [
          'players',
          'minutes',
        ]).errors
      );
      continue;
    }

    try {
      const response = await addMatchPlayer({
        matchId: createdMatchId,
        userId: id,
        minutes: parsedMinutes,
        available,
      });

      if (!response.success) {
        playerErrors.push(
          ...(response.errors ||
            formatError(`Error adding player ${id}.`, ['form']).errors)
        );
      }
    } catch (error) {
      console.error(`Error adding player ${id}:`, error);
      playerErrors.push(
        ...formatError(`Unexpected error adding player ${id}.`, ['players', id])
          .errors
      );
    }
  }

  return { errors: playerErrors };
}
