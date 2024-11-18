import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { TrainingFormValues, ErrorDetails } from '@/types/training-types';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';
import { convertCalendarDateToDate } from '@/utils/trainingPlayerUtils';

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
    const dateObj = convertCalendarDateToDate(data.date);
    formData.append('date', dateObj.toISOString());
  }
  formData.append('players', JSON.stringify(data.players));

  try {
    const response = await action(formData);

    if (response.success) {
      toast.success('Training added successfully!');
      router.push('/');
      return;
    }

    const errorMessage = formatError('Error adding training.', ['addTraining']);
    const message =
      response.errors &&
      response.errors.length > 0 &&
      response.errors[0].message
        ? response.errors[0].message
        : errorMessage.errors[0].message;

    toast.error(message);
  } catch (error) {
    console.error('Submission error:', error);
    const errorMessage = formatError('An error occurred during submission.', [
      'addTraining',
    ]);
    toast.error(errorMessage.errors[0].message);
  } finally {
    resetSubmissionState();
  }
};
