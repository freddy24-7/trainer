// This component is displays the training management page.

import ProtectedLayout from '@/app/protected-layout';
import addTraining from '@/app/actions/addTraining';
import AddTrainingForm from '@/components/AddTrainingForm';
import { getPlayers } from '@/app/actions/getPlayers'; // Action to fetch players
import { Player } from '@/lib/types'; // Import Player type definition

export default async function TrainingsPage() {
  const playerResponse = await getPlayers();

  const players: Player[] = playerResponse.success
    ? (playerResponse.players ?? []).map((player) => ({
        id: player.id,
        username: player.username ?? '',
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
