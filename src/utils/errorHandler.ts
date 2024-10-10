export function formatError(
  message: string,
  path: string[] = ['form'],
  code = 'custom'
) {
  return {
    errors: [
      {
        message,
        path,
        code,
      },
    ],
  };
}
