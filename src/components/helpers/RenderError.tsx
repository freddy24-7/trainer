import React from 'react';
import { formatError } from '@/utils/errorUtils';
import { ZodIssue } from 'zod';

export function renderError(response: {
  errors?: any[];
}): React.ReactElement | null {
  if (response.errors && response.errors.length > 0) {
    const errorMessage = response.errors
      .map((error: any) => error.message || error)
      .join(', ');
    return <div>Error loading players: {errorMessage}</div>;
  }
  return null;
}

export function handleChatErrorResponse(
  errorMessage: string = 'An error occurred',
  path: string[] = ['default']
): React.ReactElement {
  const errorResponse = formatError(errorMessage, path, 'custom', false);

  return (
    <div>
      <h2>Error</h2>
      <ul>
        {errorResponse.errors.map((err: ZodIssue, index: number) => (
          <li key={index}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
}
