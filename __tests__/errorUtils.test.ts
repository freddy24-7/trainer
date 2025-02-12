import { ZodIssue } from 'zod';

import { defaultErrorMessage } from '@/strings/serverStrings';
import { formatError, formatStringError } from '@/utils/errorUtils';

describe('formatError', () => {
  const customErrorMessage = 'Custom Error';

  it('should return default error object when no parameters are provided', () => {
    const result = formatError();

    expect(result).toEqual({
      errors: [
        {
          message: defaultErrorMessage,
          path: ['form'],
          code: 'custom',
        } as ZodIssue,
      ],
    });
  });

  it('should return error object with custom message, path, and code', () => {
    const result = formatError(customErrorMessage, ['field'], 'custom');

    expect(result).toEqual({
      errors: [
        {
          message: customErrorMessage,
          path: ['field'],
          code: 'custom',
        } as ZodIssue,
      ],
    });
  });

  it('should include success property when includeSuccess is true', () => {
    const result = formatError(customErrorMessage, ['field'], 'custom', true);

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: customErrorMessage,
          path: ['field'],
          code: 'custom',
        } as ZodIssue,
      ],
    });
  });
});

describe('formatStringError', () => {
  it('should return default error message when no message is provided', () => {
    const result = formatStringError();

    expect(result).toEqual({
      success: false,
      errors: defaultErrorMessage,
    });
  });

  it('should return custom error message', () => {
    const result = formatStringError('Something went wrong');

    expect(result).toEqual({
      success: false,
      errors: 'Something went wrong',
    });
  });
});
