import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  TrainingFormValues,
  UseAddTrainingFormProps,
  UseAddTrainingFormReturn,
} from '@/types/types';
import { convertCalendarDateToDate } from '@/utils/dateUtils';

export const useAddTrainingForm = ({
  action,
}: UseAddTrainingFormProps): UseAddTrainingFormReturn => {
  const router = useRouter();

  const onSubmit: SubmitHandler<TrainingFormValues> = async (data) => {
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
        toast.error('Error adding training.');
        console.error('Error details:', response.errors);
      }
    } catch {
      toast.error('An error occurred during submission.');
    }
  };

  return { onSubmit };
};
