'use server';

import { ZodIssue } from 'zod';

import addMatch from '@/app/actions/addMatch';
import addMatchPlayer from '@/app/actions/addMatchPlayer';
import { PlayerInMatch } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';

function handleParsePlayersData(playersString: string | null): {
  players?: PlayerInMatch[];
  errors?: ZodIssue[];
} {
  if (!playersString) {
    return formatError('Players data is missing.', ['players']);
  }

  let players: PlayerInMatch[];
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

  return { players };
}

async function handleProcessPlayer(
  player: PlayerInMatch,
  matchId: number
): Promise<ZodIssue[]> {
  const { id, minutes, available } = player;
  const playerErrors: ZodIssue[] = [];
  const parsedMinutes = available ? parseInt(minutes, 10) : 0;

  if (isNaN(parsedMinutes)) {
    return formatError(`Invalid minutes for player ${id}. Expected a number.`, [
      'players',
      'minutes',
    ]).errors;
  }

  try {
    const response = await addMatchPlayer({
      matchId,
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
      ...formatError(`Unexpected error adding player ${id}.`, [
        'players',
        String(id),
      ]).errors
    );
  }

  return playerErrors;
}

export default async function addMatchAndPlayers(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  const matchResponse = await addMatch(null, params);

  if (matchResponse.errors) {
    return formatError('Failed to create match.', ['form']);
  }

  const createdMatchId = matchResponse.match?.id;
  if (!createdMatchId) {
    return formatError('Error: Match ID not found.', ['form']);
  }

  const playersString = params.get('players') as string | null;
  const { players, errors: parsingErrors } =
    handleParsePlayersData(playersString);
  if (parsingErrors) {
    return { errors: parsingErrors };
  }

  const playerErrors: ZodIssue[] = [];
  if (players) {
    for (const player of players) {
      const errors = await handleProcessPlayer(player, createdMatchId);
      playerErrors.push(...errors);
    }
  }

  return { errors: playerErrors };
}
