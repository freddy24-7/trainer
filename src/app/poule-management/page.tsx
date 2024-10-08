import React from 'react';

import addPoule from '@/app/actions/addPoule';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import ProtectedLayout from '@/app/protected-layout';
import { AddPouleFormValidation } from '@/components/poules/AddPouleFormValidation';
import PouleManagementClient from '@/components/poules/PouleManagementClient';
import { Poule } from '@/types/types';

export default async function PouleManagementPage(): Promise<React.ReactElement> {
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
