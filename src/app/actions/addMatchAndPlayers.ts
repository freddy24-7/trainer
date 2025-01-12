'use server';

import { ZodIssue } from 'zod';

import addMatch from '@/app/actions/addMatch';
import addMatchEvent from '@/app/actions/addMatchEvent';
import addMatchPlayer from '@/app/actions/addMatchPlayer';
import {
  errorAddingPlayer,
  unexpectedErrorAddingPlayer,
  failedToCreateMatchMessage,
  matchIdNotFound,
} from '@/strings/actionStrings';
import { PlayerInMatch, MatchData } from '@/types/match-types';
import { MatchEventData } from '@/types/validation-types';
import { formatError } from '@/utils/errorUtils';
import {
  handleParsePlayersData,
  handleValidatePlayerData,
  handleParseEventsData,
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

async function handleProcessMatchEvents(
  events: MatchEventData[],
  matchId: number
): Promise<ZodIssue[]> {
  const eventErrors: ZodIssue[] = [];

  for (const event of events) {
    const eventError = await handleProcessSingleEvent({
      ...event,
      matchId,
    });
    if (eventError) {
      eventErrors.push(...eventError);
    }
  }

  return eventErrors;
}

async function handleProcessSingleEvent(
  event: MatchEventData
): Promise<ZodIssue[] | null> {
  try {
    const response = await addMatchEvent(event);

    if (!response.success) {
      return (
        response.errors ||
        formatError(`Failed to add event for user ${event.userId}`, ['form'])
          .errors
      );
    }
  } catch (error) {
    console.error(`Error adding match event for user ${event.userId}:`, error);
    return formatError(
      `Unexpected error while adding match event for user ${event.userId}`,
      ['events', String(event.userId)]
    ).errors;
  }

  return null;
}

export default async function addMatchAndPlayers(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  const matchType = params.get('matchType');
  if (
    typeof matchType !== 'string' ||
    !['PRACTICE', 'COMPETITION'].includes(matchType)
  ) {
    return formatError('Invalid match type', ['form']);
  }

  const matchData: MatchData = {
    matchType: matchType as 'PRACTICE' | 'COMPETITION',
    date: params.get('date') as string,
  };

  if (matchType === 'PRACTICE') {
    const practiceOpponent = params.get('practiceOpponent') as string;
    if (!practiceOpponent) {
      return formatError('Practice opponent name is required.', ['form']);
    }
    matchData.practiceOpponent = practiceOpponent;
  } else if (matchType === 'COMPETITION') {
    const pouleOpponentId = params.get('pouleOpponentId');
    if (!pouleOpponentId || isNaN(Number(pouleOpponentId))) {
      return formatError('Poule opponent ID is required.', ['form']);
    }
    matchData.pouleOpponentId = Number(pouleOpponentId);
  }

  const formData = new FormData();
  Object.entries(matchData).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const matchResponse = await addMatch(null, formData);

  if (matchResponse.errors) {
    return formatError(failedToCreateMatchMessage, ['form']);
  }

  const createdMatchId = matchResponse.match?.id;
  if (!createdMatchId) {
    return formatError(matchIdNotFound, ['form']);
  }

  const playersString = params.get('players') as string | null;
  const { players, errors: parsingPlayerErrors } =
    handleParsePlayersData(playersString);

  if (parsingPlayerErrors) {
    return { errors: parsingPlayerErrors };
  }

  const playerErrors = players
    ? await handleProcessPlayers(players, createdMatchId)
    : [];

  const matchEventsString = params.get('matchEvents') as string | null;
  const { matchEvents, parsingEventErrors } =
    handleParseEventsData(matchEventsString);

  if (parsingEventErrors) {
    return { errors: parsingEventErrors };
  }

  const eventErrors = matchEvents
    ? await handleProcessMatchEvents(matchEvents, createdMatchId)
    : [];

  const combinedErrors = [...playerErrors, ...eventErrors];
  return { errors: combinedErrors };
}
