import ProtectedLayout from '@/app/ProtectedLayout';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import PouleManagementClient from '@/components/PouleManagementClient';
import addPoule from '@/app/actions/addPoule';
import { AddPouleFormValidation } from '@/components/AddPouleFormValidation';
import { Poule } from '@/types/type-list';

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
