// This is a protected page that can only be accessed by users with the TRAINER role.

import ProtectedLayout from '@/app/protected-layout';
import { getPlayers } from '@/app/actions/getPlayers';
import addPlayer from '@/app/actions/addPlayer';
import PlayerManagementClient from '@/components/PlayerManagementClient';
import { AddPlayerFormValidation } from '@/components/AddPlayerFormValidation';
import { Player } from '@/lib/types';

export default async function ManagementPage() {
  const response = await getPlayers();

  // Transforming players to ensure username is always a string
  const players: Player[] = response.success
    ? (response.players ?? []).map((player) => ({
        id: player.id,
        username: player.username ?? '',
      }))
    : [];

  if (!response.success) {
    return <div>Error loading players: {response.error}</div>;
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center">
          <AddPlayerFormValidation action={addPlayer} />
          <PlayerManagementClient players={players} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
