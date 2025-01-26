import React from 'react';

import addPoule from '@/app/actions/addPoule';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import { AddPouleForm } from '@/app/poule-management/AddPouleForm';
import Mapper from '@/components/helpers/pouleHelpers/Mapper';
import ProtectedLayout from '@/app/ProtectedLayout';
import { unknownErrorOccurred } from '@/strings/serverStrings';
import { Poule } from '@/types/poule-types';
import { GetTeamsInPouleResponse } from '@/types/response-types';

export default async function PouleManagementPage(): Promise<React.ReactElement> {
  const pouleResponse: GetTeamsInPouleResponse = await getTeamsInPoule();

  const poules: Poule[] = pouleResponse.success ? pouleResponse.poules : [];

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          {!pouleResponse.success && pouleResponse.errors && (
            <p className="text-red-500 mb-4">
              {pouleResponse.errors[0]?.message ?? unknownErrorOccurred}
            </p>
          )}

          {poules.length > 0 && <Mapper poules={poules} />}

          <AddPouleForm action={addPoule} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
