import ProtectedLayout from '@/app/ProtectedLayout';
import getPlayers from '@/app/actions/getPlayers';
import addPlayer from '@/app/actions/addPlayer';
import editPlayer from '@/app/actions/editPlayer';
import deletePlayer from '@/app/actions/deletePlayer';
import DisplayPlayers from '@/app/player-management/DisplayPlayers';
import { AddPlayerForm } from '@/app/player-management/AddPlayerForm';
import { validatePlayerResponse } from '@/utils/responseUtils';
import { mapPlayers } from '@/utils/playerUtils';
import { renderError } from '@/components/helpers/RenderError';
import { Player } from '@/types/type-list';

export default async function ManagementPage() {
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
        <div className="text-center w-full max-w-3xl">
          <AddPlayerForm action={addPlayer} />
          <DisplayPlayers
            players={players}
            editPlayerAction={editPlayer}
            deletePlayerAction={deletePlayer}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
