import { toast } from 'react-toastify';
import type { ZodIssue } from 'zod';

import { Poule, PouleFormValues } from '@/types/poule-types';
import { Team } from '@/types/team-types';

interface FormControls {
  reset: () => void;
  setOpponents: (opponents: string[]) => void;
  setShowForm: (show: boolean) => void;
}

export function handleFormatPoules(
  poules: {
    id: number;
    name: string;
    team: Team;
    opponents: { id: number; team: Team }[];
  }[]
): Poule[] {
  return poules.map((poule) => ({
    id: poule.id,
    pouleName: poule.name,
    teams: [poule.team, ...poule.opponents.map((opponent) => opponent.team)],
    opponents: poule.opponents.map((opponent) => ({
      id: opponent.id,
      team: opponent.team,
    })),
  }));
}

export async function handleSubmitPouleForm(
  data: PouleFormValues,
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors?: ZodIssue[] } | void>,
  formControls: FormControls
): Promise<void> {
  const { reset, setOpponents, setShowForm } = formControls;

  const formData = new FormData();
  formData.append('pouleName', data.pouleName);
  formData.append('mainTeamName', data.mainTeamName);
  data.opponents.forEach((opponent) => {
    formData.append('opponents', opponent);
  });

  try {
    const result = await action(null, formData);

    if (result?.errors?.length) {
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
