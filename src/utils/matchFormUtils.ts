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

export const validateMatchForm = (
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

export const handleActionResponse = async (
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

  try {
    const formData = createFormData(data);

    if (!validateMatchForm(formData, validatePlayers)) {
      console.error(validationFailedMessage);
      return false;
    }

    return await handleActionResponse(action, formData);
  } catch (error) {
    console.error(
      formatError(submissionErrorMessage, ['form']).errors[0].message,
      error
    );
    toast.error(
      formatError(submissionErrorMessage, ['form']).errors[0].message
    );
    return false;
  } finally {
    resetSubmissionState();
  }
};

export const createFormData = (data: FormValues): FormData => {
  const formData = new FormData();

  formData.append('matchType', data.matchType);

  appendMatchTypeSpecificData(formData, data);

  formData.append('opponentStrength', data.opponentStrength || 'null');

  if (!data.date) {
    const errorResponse = formatError(submissionErrorMessage, ['date']);
    toast.error(errorResponse.errors[0].message);
    throw new Error(errorResponse.errors[0].message);
  }
  formData.append('date', data.date);

  formData.append(
    'players',
    JSON.stringify(
      data.players.map((player) => ({
        ...player,
        minutes: Number(player.minutes),
      }))
    )
  );

  formData.append(
    'matchEvents',
    JSON.stringify(
      (data.matchEvents || []).map((matchEvent) => ({
        playerInId: matchEvent.playerInId,
        playerOutId: matchEvent.playerOutId,
        playerId: matchEvent.playerId ?? null,
        minute: matchEvent.minute,
        eventType: matchEvent.eventType,
        substitutionReason: matchEvent.substitutionReason || null,
      }))
    )
  );

  return formData;
};

export const appendMatchTypeSpecificData = (
  formData: FormData,
  data: FormValues
): void => {
  if (data.matchType === 'competition') {
    formData.append('pouleOpponentId', data.opponent?.toString() || 'null');
  } else if (data.matchType === 'practice') {
    formData.append('opponentName', data.opponentName || '');
  }
};
