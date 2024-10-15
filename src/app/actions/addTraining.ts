'use server';

import { validateTrainingData } from '@/schemas/validation/createTrainingValidation';
import { createTraining } from '@/lib/services/createTrainingService';
import { formatError } from '@/utils/errorUtils';

export default async function addTraining(params: FormData) {
  const validation = validateTrainingData(params);

  if (!validation.success) {
    return formatError('Validation failed.', ['addTraining'], 'custom', true);
  }

  const { date, players } = validation.data;

  try {
    const training = await createTraining(date, players);
    return { success: true, training };
  } catch (error) {
    return formatError(
      'Failed to create training.',
      ['addTraining'],
      'custom',
      false
    );
  }
}
