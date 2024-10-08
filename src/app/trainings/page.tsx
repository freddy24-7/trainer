import React from 'react';

import addTraining from '@/app/actions/addTraining';
import { getPlayers } from '@/app/actions/getPlayers';
import ProtectedLayout from '@/app/protected-layout';
import AddTrainingForm from '@/components/trainings/AddTrainingForm';
import { Player } from '@/types/types';

export default async function TrainingsPage(): Promise<React.ReactElement> {
  const playerResponse = await getPlayers();

  const players: Player[] = playerResponse.success
    ? (playerResponse.players ?? []).map((player: Player) => ({
        id: player.id,
        username: player.username ?? '',
        whatsappNumber: player.whatsappNumber ?? '',
      }))
    : [];

  if (!playerResponse.success) {
    return <div>Error loading players: {playerResponse.error}</div>;
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <AddTrainingForm action={addTraining} players={players} />
      </div>
    </ProtectedLayout>
  );
}
