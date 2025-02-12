import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import {
  trainingAddedSuccess,
  errorAddingTraining,
  anErrorOccurred,
} from '@/strings/clientStrings';
import { submitTrainingForm } from '@/utils/trainingFormUtils';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../src/utils/errorUtils', () => ({
  formatError: jest.fn((msg: string) => ({
    errors: [{ message: msg }],
  })),
}));

jest.mock('../src/strings/clientStrings', () => ({
  trainingAddedSuccess: 'Training added successfully',
  errorAddingTraining: 'Error adding training',
  anErrorOccurred: 'An error occurred',
}));

describe('submitTrainingForm', () => {
  let setSubmitting: jest.Mock;
  let router: ReturnType<typeof useRouter>;
  let action: (
    params: FormData
  ) => Promise<{ success?: boolean; errors?: { message: string }[] }>;

  beforeEach(() => {
    setSubmitting = jest.fn();
    router = { push: jest.fn() } as unknown as ReturnType<typeof useRouter>;
    jest.clearAllMocks();
  });

  it('handles successful submission', async () => {
    action = jest.fn(() => Promise.resolve({ success: true }));
    const data = {
      date: '2025-01-01',
      players: [{ userId: 1, absent: false }],
    };

    await submitTrainingForm(data, action, setSubmitting, router);

    expect(setSubmitting).toHaveBeenCalledWith(true);
    expect(setSubmitting).toHaveBeenCalledWith(false);
    expect(action).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(trainingAddedSuccess);
    expect(router.push).toHaveBeenCalledWith('/');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows a custom error message when submission fails with errors', async () => {
    const customErrorMessage = 'Custom error message';
    action = jest.fn(() =>
      Promise.resolve({ errors: [{ message: customErrorMessage }] })
    );
    const data = {
      date: '2025-01-01',
      players: [{ userId: 2, absent: true }],
    };

    await submitTrainingForm(data, action, setSubmitting, router);

    expect(toast.error).toHaveBeenCalledWith(customErrorMessage);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('shows a fallback error message when errors array is empty', async () => {
    action = jest.fn(() => Promise.resolve({ errors: [] }));
    const data = {
      date: '2025-01-01',
      players: [{ userId: 3, absent: false }],
    };

    await submitTrainingForm(data, action, setSubmitting, router);

    expect(toast.error).toHaveBeenCalledWith(errorAddingTraining);
  });

  it('handles exceptions thrown during submission', async () => {
    const errorObj = new Error('fail');
    action = jest.fn(() => Promise.reject(errorObj));
    const data = {
      date: '2025-01-01',
      players: [{ userId: 4, absent: true }],
    };

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await submitTrainingForm(data, action, setSubmitting, router);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Submission error:', errorObj);
    expect(toast.error).toHaveBeenCalledWith(anErrorOccurred);

    consoleErrorSpy.mockRestore();
  });

  it('appends only players when date is falsy', async () => {
    action = jest.fn(() => Promise.resolve({ success: true }));
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    const data = {
      date: '',
      players: [{ userId: 5, absent: false }],
    };

    await submitTrainingForm(data, action, setSubmitting, router);

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledWith(
      'players',
      JSON.stringify(data.players)
    );

    appendSpy.mockRestore();
  });
});
