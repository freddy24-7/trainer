import ProtectedLayout from '@/app/ProtectedLayout';
import addTraining from '@/app/actions/addTraining';
import AddTrainingForm from '@/components/AddTrainingForm';
import getPlayers from '@/app/actions/getPlayers';
import { validatePlayerResponse } from '@/utils/responseUtils';
import { mapPlayers } from '@/utils/playerUtils';
import { renderError } from '@/components/helpers/RenderError';
import { Player } from '@/types/type-list';

export default async function TrainingsPage() {
  const response = await getPlayers();

  const validatedResponse = validatePlayerResponse(response);

  const errorElement = renderError(validatedResponse);
  if (errorElement) {
    return errorElement;
  }

  const players: Player[] = mapPlayers(validatedResponse);

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <AddTrainingForm action={addTraining} players={players} />
      </div>
    </ProtectedLayout>
  );
}
