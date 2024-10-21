'use server';

import { createTraining } from '@/lib/services/createTrainingService';
import { handleValidateTrainingData } from '@/schemas/validation/createTrainingValidation';
import { AddTrainingSuccess, AddTrainingFailure } from '@/types/training-types';
import { formatError } from '@/utils/errorUtils';

export default async function addTraining(
  params: FormData
): Promise<AddTrainingSuccess | AddTrainingFailure> {
  const validation = handleValidateTrainingData(params);

  if (!validation.success || !validation.data) {
    return formatError('Validation failed.', ['addTraining'], 'custom', true);
  }

  const { date, players } = validation.data;

  if (!date) {
    return formatError(
      'Date cannot be null.',
      ['addTraining'],
      'custom',
      false
    );
  }

  try {
    const training = await createTraining(date, players);
    return { success: true, training };
  } catch (error) {
    console.error('Error creating training:', error);
    return formatError(
      'Failed to create training.',
      ['addTraining'],
      'custom',
      false
    );
  }
}
