import ProtectedLayout from '@/app/ProtectedLayout';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import { GetTeamsInPouleResponse, Poule } from '@/types/type-list';
import Mapper from '@/app/poule-management/Mapper';
import addPoule from '@/app/actions/addPoule';
import { AddPouleForm } from '@/app/poule-management/AddPouleForm';

export default async function PouleManagementPage() {
  const pouleResponse: GetTeamsInPouleResponse = await getTeamsInPoule();

  const poules: Poule[] = pouleResponse.success ? pouleResponse.poules : [];

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          {!pouleResponse.success && pouleResponse.errors && (
            <p className="text-red-500 mb-4">
              {pouleResponse.errors[0]?.message ?? 'An unknown error occurred.'}
            </p>
          )}

          {poules.length > 0 && <Mapper poules={poules} />}

          <AddPouleForm action={addPoule} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
