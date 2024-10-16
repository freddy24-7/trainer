import { Poule } from '@/types/type-list';
import { toast } from 'react-toastify';
import type { ZodIssue } from 'zod';
import { PouleFormValues } from '@/types/type-list';

export function formatPoules(poules: any[]): Poule[] {
  return poules.map((poule) => ({
    id: poule.id,
    pouleName: poule.name,
    teams: [
      poule.team,
      ...poule.opponents.map((opponent: any) => opponent.team),
    ],
    opponents: poule.opponents.map((opponent: any) => ({
      id: opponent.id,
      team: opponent.team,
    })),
  }));
}

export async function submitPouleForm(
  data: PouleFormValues,
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] } | void>,
  reset: () => void,
  setOpponents: (opponents: string[]) => void,
  setShowForm: (show: boolean) => void
) {
  const formData = new FormData();
  formData.append('pouleName', data.pouleName);
  formData.append('mainTeamName', data.mainTeamName);
  data.opponents.forEach((opponent) => {
    formData.append('opponents', opponent);
  });

  try {
    const result = await action(null, formData);
    if (result && 'errors' in result) {
      toast.error('Failed to add poule. Please check your inputs.');
      console.error('Submission errors:', result.errors);
    } else {
      toast.success('Poule added successfully!');
      reset();
      setOpponents([]);
      setShowForm(false);
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    toast.error('An error occurred during submission.');
  }
}
