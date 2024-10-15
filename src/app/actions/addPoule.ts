'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { validatePouleData } from '@/schemas/validation/createPouleValidation';
import { formatError } from '@/utils/errorUtils';
import {
  createMainTeam,
  createPoule,
  addOpponentsToPoule,
} from '@/lib/services/createPouleService';

export default async function addPoule(
  _prevState: any,
  params: FormData
): Promise<{ errors: any[] } | void> {
  const validation = validatePouleData(params);

  if (!validation.success) {
    return formatError('Validation failed.', ['addPoule'], 'custom', true);
  }

  const { pouleName, mainTeamName, opponents } = validation.data;
  let redirectPath: string | null = null;

  try {
    const mainTeam = await createMainTeam(mainTeamName);
    const poule = await createPoule(pouleName, mainTeam.id);

    if (opponents.length > 0) {
      await addOpponentsToPoule(poule.id, opponents);
    }

    redirectPath = '/poule-management';
  } catch (error) {
    return formatError(
      'Error creating the poule or linking opponents.',
      ['form'],
      'custom'
    );
  } finally {
    if (redirectPath) {
      revalidatePath(redirectPath);
      redirect(redirectPath);
    }
  }
  return;
}
