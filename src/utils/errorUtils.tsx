import React from 'react';

export function formatError(
  message: string,
  path: string[] = ['form'],
  code = 'custom',
  includeSuccess = false
) {
  const errorObject = {
    errors: [
      {
        message,
        path,
        code,
      },
    ],
  };

  if (includeSuccess) {
    return {
      success: false,
      ...errorObject,
    };
  }

  return errorObject;
}

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
