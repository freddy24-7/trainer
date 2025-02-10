import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import {
  trainingAddedSuccess,
  errorAddingTraining,
  anErrorOccurred,
} from '@/strings/clientStrings';
import { TrainingFormValues, ErrorDetails } from '@/types/training-types';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';

export const submitTrainingForm = async (
  data: TrainingFormValues,
  action: (
    params: FormData
  ) => Promise<{ success?: boolean; errors?: ErrorDetails[] }>,
  setSubmitting: (submitting: boolean) => void,
  router: ReturnType<typeof useRouter>
): Promise<void> => {
  const resetSubmissionState = handleSubmissionState(setSubmitting);

  const formData = new FormData();

  if (data.date) {
    formData.append('date', data.date);
  }

  formData.append('players', JSON.stringify(data.players));

  try {
    const response = await action(formData);

    if (response.success) {
      toast.success(trainingAddedSuccess);
      router.push('/');
      return;
    }

    const errorMessage = formatError(errorAddingTraining, ['addTraining']);
    const message =
      response.errors &&
      response.errors.length > 0 &&
      response.errors[0].message
        ? response.errors[0].message
        : errorMessage.errors[0].message;

    toast.error(message);
  } catch (error) {
    console.error('Submission error:', error);
    const errorMessage = formatError(anErrorOccurred, ['addTraining']);
    toast.error(errorMessage.errors[0].message);
  } finally {
    resetSubmissionState();
  }
};
