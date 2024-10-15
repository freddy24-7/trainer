import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { TrainingFormValues } from '@/types/type-list';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';
import { convertCalendarDateToDate } from '@/utils/trainingPlayerUtils';

export const submitTrainingForm = async (
  data: TrainingFormValues,
  action: (params: FormData) => Promise<{ success?: boolean; errors?: any[] }>,
  setSubmitting: (submitting: boolean) => void,
  router: ReturnType<typeof useRouter>
) => {
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
    } else {
      const errorMessage = formatError('Error adding training.', [
        'addTraining',
      ]);
      toast.error(errorMessage.errors[0].message);
    }
  } catch (error) {
    const errorMessage = formatError('An error occurred during submission.', [
      'addTraining',
    ]);
    toast.error(errorMessage.errors[0].message);
  } finally {
    resetSubmissionState();
  }
};
