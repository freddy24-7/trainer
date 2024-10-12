import ProtectedLayout from '@/app/protected-layout';
import getPlayers from '@/app/actions/getPlayers';
import addPlayer from '@/app/actions/addPlayer';
import editPlayer from '@/app/actions/editPlayer';
import PlayerManagementClient from '@/components/PlayerManagementClient';
import { AddPlayerForm } from '@/components/AddPlayerForm';
import { validatePlayerResponse } from '@/utils/responseUtils';
import { mapPlayers } from '@/utils/playerUtils';
import { renderError } from '@/components/helpers/renderError';
import { Player } from '@/lib/types';

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
          {/* Pass the addPlayer action to AddPlayerForm */}
          <AddPlayerForm action={addPlayer} />
          {/* Pass the editPlayer action to PlayerManagementClient */}
          <PlayerManagementClient
            players={players}
            editPlayerAction={editPlayer}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
