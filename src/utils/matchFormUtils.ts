import { ZodIssue } from 'zod';
import { toast } from 'react-toastify';
import { formatError } from '@/utils/errorUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';
import { validateMatchData } from '@/schemas/validation/createMatchValidation';

export const submitMatchForm = async (
  data: any,
  validatePlayers: () => boolean,
  setSubmitting: (submitting: boolean) => void,
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>,
  router: any
) => {
  const resetSubmissionState = handleSubmissionState(setSubmitting);

  const formData = new FormData();
  formData.append('pouleOpponentId', data.opponent?.toString() || '');
  formData.append('date', data.date?.toString() || '');

  const matchValidationResult = validateMatchData(formData);

  if (!matchValidationResult.success) {
    const errorResponse = formatError('Validation failed for match details', [
      'form',
    ]);
    toast.error(errorResponse.errors[0].message);
    resetSubmissionState();
    return;
  }

  if (!validatePlayers()) {
    const playerErrorResponse = formatError(
      'Please enter valid minutes or mark as not available.',
      ['players']
    );
    toast.error(playerErrorResponse.errors[0].message);
    resetSubmissionState();
    return;
  }

  formData.append('players', JSON.stringify(data.players));

  try {
    const response = await action(null, formData);
    if (response.errors.length === 0) {
      toast.success('Match added successfully!');
      router.push('/');
    } else {
      const errorResponse = formatError('Error adding match.', ['form']);
      toast.error(errorResponse.errors[0].message);
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    const errorResponse = formatError('An error occurred during submission.', [
      'form',
    ]);
    toast.error(errorResponse.errors[0].message);
  } finally {
    resetSubmissionState();
  }
};
