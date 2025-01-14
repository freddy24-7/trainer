import { toast } from 'react-toastify';

import { handleValidateMatchData } from '@/schemas/validation/createMatchValidation';
import {
  validationFailedMessage,
  invalidPlayerMinutesMessage,
  matchAddedSuccessMessage,
  matchAddErrorMessage,
  submissionErrorMessage,
} from '@/strings/serverStrings';
import { SubmitMatchFormOptions } from '@/types/match-types';
import { FormValues } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';

const validateMatchForm = (
  formData: FormData,
  validatePlayers: () => boolean
): boolean => {
  for (const [key, value] of formData.entries()) {
    console.log(`FormData Entry: ${key}:`, value);
  }
  const matchValidationResult = handleValidateMatchData(formData);

  if (!matchValidationResult.success) {
    const errorResponse = formatError(validationFailedMessage, ['form']);
    toast.error(errorResponse.errors[0].message);
    return false;
  }

  if (!validatePlayers()) {
    const playerErrorResponse = formatError(invalidPlayerMinutesMessage, [
      'players',
    ]);
    toast.error(playerErrorResponse.errors[0].message);
    return false;
  }

  return true;
};

const handleActionResponse = async (
  action: SubmitMatchFormOptions['action'],
  formData: FormData
): Promise<boolean> => {
  try {
    const response = await action(null, formData);
    if (response.errors.length === 0) {
      toast.success(matchAddedSuccessMessage);
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
  }
};

export const submitMatchForm = async (
  data: FormValues,
  options: SubmitMatchFormOptions
): Promise<boolean> => {
  const { validatePlayers, setSubmitting, action } = options;
  const resetSubmissionState = handleSubmissionState(setSubmitting);

  const formData = new FormData();

  formData.append('matchType', data.matchType);

  if (data.matchType === 'competition') {
    formData.append('pouleOpponentId', data.opponent?.toString() || 'null');
  } else if (data.matchType === 'practice') {
    formData.append('opponentName', data.opponentName || '');
  }

  if (data.date) {
    formData.append('date', data.date);
  } else {
    console.error('Date is missing in the form data.');
    resetSubmissionState();
    return false;
  }

  formData.append(
    'players',
    JSON.stringify(
      data.players.map((player) => ({
        ...player,
        minutes: Number(player.minutes),
      }))
    )
  );

  if (!validateMatchForm(formData, validatePlayers)) {
    console.error('Validation failed:', formData);
    resetSubmissionState();
    return false;
  }

  const result = await handleActionResponse(action, formData);

  resetSubmissionState();
  return result;
};
