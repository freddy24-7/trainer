'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ZodIssue } from 'zod';

import {
  createMainTeam,
  createPoule,
  addOpponentsToPoule,
} from '@/lib/services/createPouleService';
import { handleValidatePouleData } from '@/schemas/validation/createPouleValidation';
import { PouleFormData } from '@/types/poule-types';
import { formatError } from '@/utils/errorUtils';

export default async function addPoule(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[] } | void> {
  const validation = handleValidatePouleData(params);

  if (!validation.success || !validation.data) {
    return formatError('Validation failed.', ['addPoule'], 'custom', true);
  }

  const { pouleName, mainTeamName, opponents } =
    validation.data as PouleFormData;
  let redirectPath: string | null = null;

  try {
    const mainTeam = await createMainTeam(mainTeamName);

    if (!mainTeam) {
      return formatError(
        'Failed to create main team.',
        ['addPoule'],
        'custom',
        false
      ) as { errors: ZodIssue[] };
    }

    const poule = await createPoule(pouleName, mainTeam.id);

    if (opponents.length > 0) {
      await addOpponentsToPoule(poule.id, opponents);
    }

    redirectPath = '/poule-management';
  } catch (error) {
    console.error('Error creating the poule:', error);
    return formatError(
      'Error creating the poule or linking opponents.',
      ['form'],
      'custom'
    ) as { errors: ZodIssue[] };
  } finally {
    if (redirectPath) {
      revalidatePath(redirectPath);
      redirect(redirectPath);
    }
  }

  return;
}
