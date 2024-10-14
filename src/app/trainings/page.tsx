import ProtectedLayout from '@/app/ProtectedLayout';
import addTraining from '@/app/actions/addTraining';
import AddTrainingForm from '@/components/AddTrainingForm';
import getPlayers from '@/app/actions/getPlayers';
import { Player } from '@/lib/types';

export default async function TrainingsPage() {
  const playerResponse = await getPlayers();

  const players: Player[] = playerResponse.success
    ? (playerResponse.players ?? []).map((player) => ({
        id: player.id,
        username: player.username ?? '',
        whatsappNumber: player.whatsappNumber ?? '',
      }))
    : [];

  if (!playerResponse.success) {
    return <div>Error loading players: {playerResponse.errors}</div>;
  }

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
        <AddTrainingForm action={addTraining} players={players} />
      </div>
    </ProtectedLayout>
  );
}
