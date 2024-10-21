import React from 'react';
import { ZodIssue } from 'zod';

import addMatchAndPlayers from '@/app/actions/addMatchAndPlayers';
import getPlayers from '@/app/actions/getPlayers';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import { AddMatchForm } from '@/app/matches/AddMatchForm';
import ProtectedLayout from '@/app/ProtectedLayout';
import {
  GetTeamsInPouleResponse,
  GetTeamsInPouleError,
} from '@/types/response-types';
import { ResponseError } from '@/types/shared-types';
import { PlayerResponseData } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';
import { handleMapPlayers } from '@/utils/playerUtils';

function handleIsResponseErrorOrZodIssue(
  error: unknown
): error is ZodIssue | ResponseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('message' in error || 'path' in error)
  );
}

function handleMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

function getErrorMessage(
  pouleResponse: GetTeamsInPouleResponse,
  playerResponse: PlayerResponseData
): string {
  if (
    !pouleResponse.success &&
    (pouleResponse as GetTeamsInPouleError).errors?.[0] &&
    handleMessage((pouleResponse as GetTeamsInPouleError).errors[0])
  ) {
    return formatError(
      (pouleResponse as GetTeamsInPouleError).errors[0].message,
      ['poules'],
      'custom',
      true
    ).errors[0].message;
  } else if (
    playerResponse.errors?.[0] &&
    handleMessage(playerResponse.errors[0])
  ) {
    return formatError(
      playerResponse.errors[0].message,
      ['players'],
      'custom',
      true
    ).errors[0].message;
  } else {
    return 'Unknown error';
  }
}

export default async function MatchManagementPage(): Promise<React.ReactElement> {
  const pouleResponse = await getTeamsInPoule();
  const playerResponse = await getPlayers();

  const playerResponseWithValidatedErrors: PlayerResponseData = {
    ...playerResponse,
    success: playerResponse.success ?? false,
    errors: Array.isArray(playerResponse.errors)
      ? playerResponse.errors.filter(handleIsResponseErrorOrZodIssue)
      : undefined,
  };

  const players = handleMapPlayers(playerResponseWithValidatedErrors);

  if (!pouleResponse.success || !playerResponseWithValidatedErrors.success) {
    const errorMessage = getErrorMessage(
      pouleResponse,
      playerResponseWithValidatedErrors
    );
    return <div>Error loading data: {errorMessage}</div>;
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          <AddMatchForm
            poules={pouleResponse.poules || []}
            players={players}
            action={addMatchAndPlayers}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
