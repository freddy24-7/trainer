import { handleSubmissionState } from '@/utils/submissionUtils';

describe('handleSubmissionState', () => {
  let setSubmitting: jest.Mock;
  let onStart: jest.Mock;
  let onAbort: jest.Mock;

  beforeEach(() => {
    setSubmitting = jest.fn();
    onStart = jest.fn();
    onAbort = jest.fn();
  });

  it('calls onStart if provided', () => {
    handleSubmissionState(setSubmitting, onStart);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('returns a function that sets submitting state to false', () => {
    const cleanup = handleSubmissionState(setSubmitting);
    cleanup();

    expect(setSubmitting).toHaveBeenCalledWith(false);
    expect(setSubmitting).toHaveBeenCalledTimes(2);
  });

  it('calls onAbort when cleanup function is executed', () => {
    const cleanup = handleSubmissionState(setSubmitting, undefined, onAbort);
    cleanup();

    expect(onAbort).toHaveBeenCalledTimes(1);
  });

  it('works correctly when all optional callbacks are provided', () => {
    const cleanup = handleSubmissionState(setSubmitting, onStart, onAbort);

    expect(setSubmitting).toHaveBeenCalledWith(true);
    expect(onStart).toHaveBeenCalledTimes(1);

    cleanup();

    expect(setSubmitting).toHaveBeenCalledWith(false);
    expect(onAbort).toHaveBeenCalledTimes(1);
  });
});
