'use server';

import { ZodIssue } from 'zod';

import addMatch from '@/app/actions/addMatch';
import addMatchPlayer from '@/app/actions/addMatchPlayer';
import {
  errorAddingPlayer,
  unexpectedErrorAddingPlayer,
  failedToCreateMatchMessage,
  matchIdNotFound,
} from '@/strings/actionStrings';
import { PlayerInMatch } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';
import {
  handleParsePlayersData,
  handleValidatePlayerData,
} from '@/utils/playerUtils';

async function handleProcessPlayers(
  players: PlayerInMatch[],
  matchId: number
): Promise<ZodIssue[]> {
  console.log('Processing players with matchId:', matchId, 'players:', players);

  if (!matchId) {
    console.error('Error: matchId is undefined in handleProcessPlayers');
    throw new Error('matchId is required but was undefined');
  }

  const playerErrors: ZodIssue[] = [];

  for (const player of players) {
    console.log('Validating player:', player);

    const { isValid, parsedMinutes, errors } = handleValidatePlayerData(player);

    if (!isValid) {
      console.log('Player validation failed:', errors);
      playerErrors.push(...errors);
      continue;
    }

    console.log('Player validation passed:', { player, parsedMinutes });

    const playerError = await handleProcessSinglePlayer(
      player,
      matchId,
      parsedMinutes
    );
    if (playerError) {
      console.log('Player processing error:', playerError);
      playerErrors.push(...playerError);
    }
  }

  return playerErrors;
}

async function handleProcessSinglePlayer(
  player: PlayerInMatch,
  matchId: number,
  parsedMinutes: number
): Promise<ZodIssue[] | null> {
  console.log('Processing single player:', {
    player,
    matchId,
    parsedMinutes,
  });

  if (!matchId) {
    console.error('Error: matchId is undefined in handleProcessSinglePlayer');
    throw new Error('matchId is required but was undefined');
  }

  try {
    const response = await addMatchPlayer({
      matchId,
      userId: player.id,
      minutes: parsedMinutes,
      available: player.available,
    });

    console.log('addMatchPlayer response:', response);

    if (!response.success) {
      return (
        response.errors ||
        formatError(`${errorAddingPlayer} ${player.id}.`, ['form']).errors
      );
    }
  } catch (error) {
    console.error(`${unexpectedErrorAddingPlayer} ${player.id}:`, error);
    return formatError(`${unexpectedErrorAddingPlayer} ${player.id}.`, [
      'players',
      String(player.id),
    ]).errors;
  }

  return null;
}

export default async function addMatchAndPlayers(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  console.log('Starting match and players creation with params:', params);

  const matchResponse = await addMatch(null, params);
  console.log('AddMatch response:', matchResponse);

  if (matchResponse.errors) {
    console.log('AddMatch errors:', matchResponse.errors);
    return formatError(failedToCreateMatchMessage, ['form']);
  }

  const createdMatchId = matchResponse.match?.id;
  console.log('Created Match ID:', createdMatchId);

  if (!createdMatchId) {
    console.error('Error: Match ID not found in response');
    return formatError(matchIdNotFound, ['form']);
  }

  const playersString = params.get('players') as string | null;
  console.log('Raw players string:', playersString);

  const { players, errors: parsingErrors } =
    handleParsePlayersData(playersString);

  console.log('Parsed players:', players);
  if (parsingErrors) {
    console.log('Player parsing errors:', parsingErrors);
    return { errors: parsingErrors };
  }

  const playerErrors = players
    ? await handleProcessPlayers(players, createdMatchId)
    : [];

  console.log('Player processing errors:', playerErrors);
  return { errors: playerErrors };
}
