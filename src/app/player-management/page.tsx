import React from 'react';
import { ZodIssue } from 'zod';

import addPlayer from '@/app/actions/addPlayer';
import deletePlayer from '@/app/actions/deletePlayer';
import editPlayer from '@/app/actions/editPlayer';
import getPlayers from '@/app/actions/getPlayers';
import { AddPlayerForm } from '@/app/player-management/AddPlayerForm';
import ProtectedLayout from '@/app/ProtectedLayout';
import { DisplayPlayers } from '@/components/helpers/playerHelpers/DisplayPlayers';
import { handleRenderError } from '@/components/RenderError';
import { ResponseError } from '@/types/shared-types';
import { Player } from '@/types/user-types';
import { handleMapPlayers } from '@/utils/playerUtils';
import { handlePlayerResponse } from '@/utils/responseUtils';

export default async function ManagementPage(): Promise<React.ReactElement> {
  const response = await getPlayers();

  const validatedResponse = handlePlayerResponse({
    ...response,
    errors: Array.isArray(response.errors)
      ? (response.errors as (ResponseError | ZodIssue)[])
      : undefined,
  });

  const errorElement = handleRenderError(validatedResponse);
  if (errorElement) {
    return errorElement;
  }

  const players: Player[] = handleMapPlayers(validatedResponse);

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center w-full max-w-3xl">
          <AddPlayerForm action={addPlayer} />
          <DisplayPlayers
            players={players}
            editPlayerAction={editPlayer}
            deletePlayerAction={deletePlayer}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
