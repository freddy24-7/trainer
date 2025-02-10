import React from 'react';
import { ZodIssue } from 'zod';

import {
  errorLoadingPlayers,
  genericErrorMessage,
  errorHeading,
} from '@/strings/clientStrings';
import { ResponseError } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';

export function handleRenderError(response: {
  errors?: (ResponseError | ZodIssue)[];
}): React.ReactElement | null {
  if (response.errors && response.errors.length > 0) {
    const errorMessage = response.errors
      .map(
        (error) =>
          (error as ResponseError).message ||
          (error as ZodIssue).message ||
          'Unknown error'
      )
      .join(', ');
    return (
      <div>
        {errorLoadingPlayers} {errorMessage}
      </div>
    );
  }
  return null;
}

export function handleChatErrorResponse(
  errorMessage: string = genericErrorMessage,
  path: string[] = ['default']
): React.ReactElement {
  const errorResponse = formatError(errorMessage, path, 'custom', false);

  return (
    <div>
      <h2>{errorHeading}</h2>
      <ul>
        {errorResponse.errors.map((err: ZodIssue, index: number) => (
          <li key={index}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
}
