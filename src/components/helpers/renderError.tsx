import React from 'react';

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
