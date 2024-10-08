import React from 'react';

import addMatchAndPlayers from '@/app/actions/addMatchAndPlayers';
import { getPlayers } from '@/app/actions/getPlayers';
import { getTeamsInPoule } from '@/app/actions/getTeamsInPoule';
import ProtectedLayout from '@/app/protected-layout';
import { AddMatchForm } from '@/components/matches/AddMatchForm';
import { Player } from '@/types/types';

export default async function MatchManagementPage(): Promise<React.ReactElement> {
  const pouleResponse = await getTeamsInPoule();
  const playerResponse = await getPlayers();

  const players: Player[] = playerResponse.success
    ? (playerResponse.players ?? []).map((player: Player) => ({
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
