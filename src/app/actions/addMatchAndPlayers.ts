'use server';

import { ZodIssue } from 'zod';

import addMatch from '@/app/actions/addMatch';
import addMatchPlayer from '@/app/actions/addMatchPlayer';
import { MatchPlayer } from '@/types/types';

function handleMatchValidation(params: FormData): ZodIssue[] | null {
  const errors: ZodIssue[] = [];

  const pouleOpponentIdString = params.get('pouleOpponentId') as string | null;
  if (!pouleOpponentIdString) {
    errors.push({
      message: 'Poule opponent ID is missing.',
      path: ['pouleOpponentId'],
      code: 'custom',
    });
  } else {
    const pouleOpponentId = parseInt(pouleOpponentIdString, 10);
    if (isNaN(pouleOpponentId)) {
      errors.push({
        message: 'Invalid opponent ID. Expected a number.',
        path: ['pouleOpponentId'],
        code: 'custom',
      });
    }
  }

  const date = params.get('date') as string | null;
  if (!date) {
    errors.push({
      message: 'Date is required.',
      path: ['date'],
      code: 'custom',
    });
  }

  const playersString = params.get('players') as string | null;
  if (!playersString) {
    errors.push({
      message: 'Players data is missing.',
      path: ['players'],
      code: 'custom',
    });
  }

  return errors.length > 0 ? errors : null;
}

function fetchParsedPlayers(playersString: string | null): {
  players: MatchPlayer[];
  errors: ZodIssue[];
} {
  const errors: ZodIssue[] = [];
  let players: MatchPlayer[] = [];

  if (!playersString) {
    return { players, errors };
  }

  try {
    players = JSON.parse(playersString);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error parsing players data';
    errors.push({
      message: `Invalid player data format: ${errorMessage}`,
      path: ['players'],
      code: 'custom',
    });
    return { players, errors };
  }

  if (!Array.isArray(players)) {
    errors.push({
      message: 'Players data is not an array.',
      path: ['players'],
      code: 'custom',
    });
  }

  return { players, errors };
}

function handleValidateParsedMinutes(
  minutes: string,
  available: boolean,
  id: number
): ZodIssue | null {
  const parsedMinutes = available ? parseInt(minutes, 10) : 0;

  if (available && (isNaN(parsedMinutes) || parsedMinutes <= 0)) {
    return {
      message: `Invalid minutes for player ${id}. Expected a positive number.`,
      path: ['players', 'minutes'],
      code: 'custom',
    };
  }

  return null;
}

async function addPlayerAndHandleErrors(
  createdMatchId: number,
  player: MatchPlayer
): Promise<ZodIssue | null> {
  try {
    const response = await addMatchPlayer({
      matchId: createdMatchId,
      userId: player.id,
      minutes: parseInt(player.minutes, 10),
      available: player.available,
    });

    if (!response.success) {
      return {
        message: 'Error adding player',
        path: ['form'],
        code: 'custom',
      };
    }

    return null;
  } catch (error) {
    console.error(`Error adding player ${player.id}:`, error);
    return {
      message: `Unexpected error adding player ${player.id}.`,
      path: ['players', player.id],
      code: 'custom',
    };
  }
}

async function handlePlayers(
  players: MatchPlayer[],
  createdMatchId: number
): Promise<ZodIssue[]> {
  const playerErrors: ZodIssue[] = [];

  for (const player of players) {
    const error = handleValidateParsedMinutes(
      player.minutes,
      player.available,
      player.id
    );
    if (error) {
      playerErrors.push(error);
      continue;
    }

    const responseError = await addPlayerAndHandleErrors(
      createdMatchId,
      player
    );
    if (responseError) {
      playerErrors.push(responseError);
    }
  }

  return playerErrors;
}

export default async function createMatchAndPlayers(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  const inputErrors = handleMatchValidation(params);
  if (inputErrors) {
    return { errors: inputErrors };
  }

  const { players, errors: playerParseErrors } = fetchParsedPlayers(
    params.get('players') as string | null
  );
  if (playerParseErrors.length > 0) {
    return { errors: playerParseErrors };
  }

  const matchResponse = await addMatch(null, params);
  if (matchResponse.errors) {
    return { errors: matchResponse.errors };
  }

  const { match } = matchResponse;
  const createdMatchId = match?.id;
  if (!createdMatchId) {
    return {
      errors: [
        {
          message: 'Error: Match ID not found.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }

  const playerErrors = await handlePlayers(players, createdMatchId);
  return { errors: playerErrors };
}
