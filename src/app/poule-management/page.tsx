// This server component fetches the teams in a poule and renders the list of teams.

import ProtectedLayout from '@/app/protected-layout';
import addPoule from '@/app/actions/addPoule';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import PouleManagementClient from '@/components/PouleManagementClient';
import { AddPouleFormValidation } from '@/components/AddPouleFormValidation';

export default async function PouleManagementPage() {
  const response = await getTeamsInPoule();

  // Check if there is no poule yet and handle that scenario
  if (!response.success || !response.poules) {
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {response.error ?? 'An unknown error occurred.'}
            </p>
            <AddPouleFormValidation action={addPoule} />
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          <PouleManagementClient poules={response.poules} />{' '}
        </div>
      </div>
    </ProtectedLayout>
  );
}
