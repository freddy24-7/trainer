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
  const playerErrors: ZodIssue[] = [];

  for (const player of players) {
    const { isValid, parsedMinutes, errors } = handleValidatePlayerData(player);

    if (!isValid) {
      playerErrors.push(...errors);
      continue;
    }

    const playerError = await handleProcessSinglePlayer(
      player,
      matchId,
      parsedMinutes
    );
    if (playerError) {
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
  try {
    const response = await addMatchPlayer({
      matchId,
      userId: player.id,
      minutes: parsedMinutes,
      available: player.available,
    });

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
  const matchResponse = await addMatch(null, params);

  if (matchResponse.errors) {
    return formatError(failedToCreateMatchMessage, ['form']);
  }

  const createdMatchId = matchResponse.match?.id;
  if (!createdMatchId) {
    return formatError(matchIdNotFound, ['form']);
  }

  const playersString = params.get('players') as string | null;
  const { players, errors: parsingErrors } =
    handleParsePlayersData(playersString);

  if (parsingErrors) {
    return { errors: parsingErrors };
  }

  const playerErrors = players
    ? await handleProcessPlayers(players, createdMatchId)
    : [];

  return { errors: playerErrors };
}
