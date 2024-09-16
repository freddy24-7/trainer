// This server action adds a match player to the database.

'use server';

import { ZodIssue } from 'zod';
import addMatch from '@/app/actions/addMatch';
import addMatchPlayer from '@/app/actions/addMatchPlayer';

export default async function addMatchAndPlayers(
  _prevState: any,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  const pouleOpponentIdString = params.get('pouleOpponentId') as string | null;
  if (!pouleOpponentIdString) {
    return {
      errors: [
        {
          message: 'Poule opponent ID is missing.',
          path: ['pouleOpponentId'],
          code: 'custom',
        },
      ],
    };
  }

  const pouleOpponentId = parseInt(pouleOpponentIdString, 10);
  if (isNaN(pouleOpponentId)) {
    return {
      errors: [
        {
          message: 'Invalid opponent ID. Expected a number.',
          path: ['pouleOpponentId'],
          code: 'custom',
        },
      ],
    };
  }

  const date = params.get('date') as string | null;
  if (!date) {
    return {
      errors: [
        {
          message: 'Date is required.',
          path: ['date'],
          code: 'custom',
        },
      ],
    };
  }

  const playersString = params.get('players') as string | null;
  if (!playersString) {
    return {
      errors: [
        {
          message: 'Players data is missing.',
          path: ['players'],
          code: 'custom',
        },
      ],
    };
  }

  let players;
  try {
    players = JSON.parse(playersString);
    if (!Array.isArray(players)) {
      return {
        errors: [
          {
            message: 'Players data is not an array.',
            path: ['players'],
            code: 'custom',
          },
        ],
      };
    }
  } catch (error) {
    console.error('Error parsing players data:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error parsing players data';
    return {
      errors: [
        {
          message: `Invalid player data format: ${errorMessage}`,
          path: ['players'],
          code: 'custom',
        },
      ],
    };
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

  const playerErrors: ZodIssue[] = [];
  for (const player of players) {
    const { id, minutes, available } = player;

    const parsedMinutes = parseInt(minutes, 10);
    if (isNaN(parsedMinutes)) {
      playerErrors.push({
        message: `Invalid minutes for player ${id}. Expected a number.`,
        path: ['players', 'minutes'],
        code: 'custom',
      });
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
          ...(response.errors || [
            {
              message: `Error adding player ${id}.`,
              path: ['form'],
              code: 'custom',
            },
          ])
        );
      }
    } catch (error) {
      console.error(`Error adding player ${id}:`, error);
      playerErrors.push({
        message: `Unexpected error adding player ${id}.`,
        path: ['players', id],
        code: 'custom',
      });
    }
  }

  return { errors: playerErrors };
}
