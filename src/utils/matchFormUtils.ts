import { toast } from 'react-toastify';
import { ZodIssue } from 'zod';

import { handleValidateMatchData } from '@/schemas/validation/createMatchValidation';
import { MatchFormValues } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';

interface SubmitMatchFormOptions {
  validatePlayers: () => boolean;
  setSubmitting: (submitting: boolean) => void;
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}

export const submitMatchForm = async (
  data: MatchFormValues,
  options: SubmitMatchFormOptions
): Promise<boolean> => {
  const { validatePlayers, setSubmitting, action } = options;
  const resetSubmissionState = handleSubmissionState(setSubmitting);

  const formData = new FormData();
  formData.append('pouleOpponentId', data.opponent?.toString() || '');
  formData.append('date', data.date?.toString() || '');

  const matchValidationResult = handleValidateMatchData(formData);

  if (!matchValidationResult.success) {
    const errorResponse = formatError('Validation failed for match details', [
      'form',
    ]);
    toast.error(errorResponse.errors[0].message);
    resetSubmissionState();
    return false;
  }

  if (!validatePlayers()) {
    const playerErrorResponse = formatError(
      'Please enter valid minutes or mark as not available.',
      ['players']
    );
    toast.error(playerErrorResponse.errors[0].message);
    resetSubmissionState();
    return false;
  }

  formData.append('players', JSON.stringify(data.players));

  try {
    const response = await action(null, formData);
    if (response.errors.length === 0) {
      toast.success('Match added successfully!');
      resetSubmissionState();
      return true;
    } else {
      const errorResponse = formatError('Error adding match.', ['form']);
      toast.error(errorResponse.errors[0].message);
      return false;
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    const errorResponse = formatError('An error occurred during submission.', [
      'form',
    ]);
    toast.error(errorResponse.errors[0].message);
    return false;
  } finally {
    resetSubmissionState();
  }
};
