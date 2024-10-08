// This server component fetches the teams in a poule and renders the list of teams.

import ProtectedLayout from '@/app/protected-layout';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import PouleManagementClient from '@/components/PouleManagementClient';
import addPoule from '@/app/actions/addPoule';
import { AddPouleFormValidation } from '@/components/AddPouleFormValidation';
import { Poule } from '@/lib/types';

export default async function PouleManagementPage() {
  const pouleResponse = await getTeamsInPoule();

  const poules: Poule[] = pouleResponse.poules || [];

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          {!pouleResponse.success && (
            <p className="text-red-500 mb-4">
              {pouleResponse.error ?? 'An unknown error occurred.'}
            </p>
          )}

          {poules.length > 0 && <PouleManagementClient poules={poules} />}

          <AddPouleFormValidation action={addPoule} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
