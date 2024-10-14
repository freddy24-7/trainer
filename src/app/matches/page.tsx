import ProtectedLayout from '@/app/ProtectedLayout';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import getPlayers from '@/app/actions/getPlayers';
import { AddMatchForm } from '@/app/matches/AddMatchForm';
import addMatchAndPlayers from '@/app/actions/addMatchAndPlayers';
import { mapPlayers } from '@/utils/playerUtils';
import { formatError } from '@/utils/errorUtils';

export default async function MatchManagementPage() {
  const pouleResponse = await getTeamsInPoule();
  const playerResponse = await getPlayers();

  const players = mapPlayers(playerResponse);

  if (!pouleResponse.success || !playerResponse.success) {
    const errorMessage = pouleResponse.error || playerResponse.errors;
    const errorResponse = formatError(`Error loading data: ${errorMessage}`, [
      'data',
    ]);

    return <div>Error loading data: {errorResponse.errors[0].message}</div>;
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          <AddMatchForm
            poules={pouleResponse.poules || []}
            players={players}
            action={addMatchAndPlayers}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
