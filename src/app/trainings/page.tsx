import React from 'react';
import { ZodIssue } from 'zod';

import addTraining from '@/app/actions/addTraining';
import getPlayers from '@/app/actions/getPlayers';
import ProtectedLayout from '@/app/ProtectedLayout';
import AddTrainingForm from '@/app/trainings/AddTrainingForm';
import { handleRenderError } from '@/components/RenderError';
import { ResponseError } from '@/types/shared-types';
import { Player } from '@/types/user-types';
import { handleMapPlayers } from '@/utils/playerUtils';
import { handlePlayerResponse } from '@/utils/responseUtils';

export default async function TrainingsPage(): Promise<React.ReactElement> {
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
        <AddTrainingForm action={addTraining} players={players} />
      </div>
    </ProtectedLayout>
  );
}
