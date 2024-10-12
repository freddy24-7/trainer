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
