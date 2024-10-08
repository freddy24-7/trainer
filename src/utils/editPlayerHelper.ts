import { ZodIssue } from 'zod';

import editPlayer from '@/app/actions/editPlayer';

export const editPlayerHelper = async (
  playerId: number,
  params: FormData,
  setSubmitting: (submitting: boolean) => void
): Promise<{ errors: ZodIssue[]; success: boolean }> => {
  setSubmitting(true);
  try {
    const response = await editPlayer(playerId, params);
    setSubmitting(false);

    return {
      ...response,
      success: response.success ?? false,
    };
  } catch (error) {
    setSubmitting(false);
    throw error;
  }
};
