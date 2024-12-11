import { toast } from 'react-toastify';

import { handleValidateMatchData } from '@/schemas/validation/createMatchValidation';
import {
  validationFailedMessage,
  invalidPlayerMinutesMessage,
  matchAddedSuccessMessage,
  matchAddErrorMessage,
  submissionErrorMessage,
} from '@/strings/serverStrings';
import { MatchFormValues, SubmitMatchFormOptions } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';

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
    const errorResponse = formatError(validationFailedMessage, ['form']);
    toast.error(errorResponse.errors[0].message);
    resetSubmissionState();
    return false;
  }

  if (!validatePlayers()) {
    const playerErrorResponse = formatError(invalidPlayerMinutesMessage, [
      'players',
    ]);
    toast.error(playerErrorResponse.errors[0].message);
    resetSubmissionState();
    return false;
  }

  formData.append('players', JSON.stringify(data.players));

  try {
    const response = await action(null, formData);
    if (response.errors.length === 0) {
      toast.success(matchAddedSuccessMessage);
      resetSubmissionState();
      return true;
    } else {
      const errorResponse = formatError(matchAddErrorMessage, ['form']);
      toast.error(errorResponse.errors[0].message);
      return false;
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    const errorResponse = formatError(submissionErrorMessage, ['form']);
    toast.error(errorResponse.errors[0].message);
    return false;
  } finally {
    resetSubmissionState();
  }
};
