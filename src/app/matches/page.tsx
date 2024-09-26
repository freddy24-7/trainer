// This server component fetches the teams in a poule and passes props to the form on the client.

import ProtectedLayout from '@/app/protected-layout';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import { getPlayers } from '@/app/actions/getPlayers';
import { AddMatchForm } from '@/components/AddMatchForm';
import addMatchAndPlayers from '@/app/actions/addMatchAndPlayers';
import { Player } from '@/lib/types';

export default async function MatchManagementPage() {
  const pouleResponse = await getTeamsInPoule();
  const playerResponse = await getPlayers();

  const players: Player[] = playerResponse.success
    ? (playerResponse.players ?? []).map((player) => ({
        id: player.id,
        username: player.username ?? '',
        whatsappNumber: player.whatsappNumber ?? '',
      }))
    : [];

  if (!pouleResponse.success || !playerResponse.success) {
    return (
      <div>
        Error loading data: {pouleResponse.error || playerResponse.error}
      </div>
    );
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
