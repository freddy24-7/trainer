import React from 'react';

import addPlayer from '@/app/actions/addPlayer';
import { getPlayers } from '@/app/actions/getPlayers';
import ProtectedLayout from '@/app/protected-layout';
import { AddPlayerFormValidation } from '@/components/players/AddPlayerFormValidation';
import PlayerManagementClient from '@/components/players/PlayerManagementClient';
import { Player } from '@/types/types';

export default async function ManagementPage(): Promise<React.ReactElement> {
  const response = await getPlayers();

  const players: Player[] = response.success
    ? (response.players ?? []).map((player: Player) => ({
        id: player.id,
        username: player.username ?? '',
        whatsappNumber: player.whatsappNumber ?? '',
      }))
    : [];

  if (!response.success) {
    return <div>Error loading players: {response.error}</div>;
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="text-center w-full max-w-3xl">
          <AddPlayerFormValidation action={addPlayer} />
          <PlayerManagementClient players={players} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
