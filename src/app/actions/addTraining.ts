'use server';

import { createTraining } from '@/lib/services/createTrainingService';
import { handleValidateTrainingData } from '@/schemas/validation/createTrainingValidation';
import {
  validationFailedMessage,
  dateCannotBeNull,
  failedToCreateTraining,
} from '@/strings/actionStrings';
import { AddTrainingSuccess, AddTrainingFailure } from '@/types/training-types';
import { formatError } from '@/utils/errorUtils';

export default async function addTraining(
  params: FormData
): Promise<AddTrainingSuccess | AddTrainingFailure> {
  const validation = handleValidateTrainingData(params);

  if (!validation.success || !validation.data) {
    return formatError(
      validationFailedMessage,
      ['addTraining'],
      'custom',
      true
    );
  }

  const { date, players } = validation.data;

  if (!date) {
    return formatError(dateCannotBeNull, ['addTraining'], 'custom', false);
  }

  try {
    const training = await createTraining(date, players);
    return { success: true, training };
  } catch (error) {
    console.error(failedToCreateTraining, error);
    return formatError(
      failedToCreateTraining,
      ['addTraining'],
      'custom',
      false
    );
  }
}
