import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { ZodIssue } from 'zod';

import { FormValues } from '@/types/types';
import { convertCalendarDateToDate } from '@/utils/dateUtils';
import { handleValidatePlayers } from '@/utils/validatePlayers';

function useMatchFormSubmit(
  action: (
    _prevState: Record<string, unknown> | null,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>
): (data: FormValues) => Promise<void> {
  const router = useRouter();

  return async (data: FormValues) => {
    console.log('Submitting data:', data.players);

    if (!handleValidatePlayers(data.players)) {
      toast.error('Please enter valid minutes or mark as not available.');
      return;
    }

    const playersData = data.players.map((player) => {
      if (!player.available) {
        return {
          ...player,
          minutes: 0,
        };
      } else {
        return {
          ...player,
          minutes: parseInt(player.minutes as string, 10),
        };
      }
    });

    const formData = new FormData();
    if (data.opponent !== undefined) {
      formData.append('pouleOpponentId', data.opponent.toString());
    }
    if (data.date) {
      const jsDate = convertCalendarDateToDate(data.date);
      formData.append('date', jsDate.toISOString());
    }
    formData.append('players', JSON.stringify(playersData));

    try {
      const response = await action(null, formData);
      if (response.errors.length === 0) {
        toast.success('Match added successfully!');
        router.push('/');
      } else {
        toast.error('Error adding match.');
        console.error('Error details:', response.errors);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred during submission.');
    }
  };
}

export default useMatchFormSubmit;
