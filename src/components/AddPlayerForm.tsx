// This component is used to add a new player

import PlayerForm from './PlayerForm';
import { addPlayer } from '@/app/actions/addPlayer';

interface AddPlayerFormProps {
  onPlayerAdded: (newPlayer: { id: number; username: string }) => void;
  onSubmissionStart: () => void;
  onAbort: () => void;
}

export default function AddPlayerForm({
  onPlayerAdded,
  onSubmissionStart,
  onAbort,
}: AddPlayerFormProps) {
  const handleAddPlayer = async (data: {
    username: string;
    password: string;
  }) => {
    const response = await addPlayer(data);
    if (response.success) {
      onPlayerAdded({ id: Math.random(), username: data.username });
    } else {
      throw new Error(response.error || 'Error registering the player.');
    }
  };

  return (
    <PlayerForm
      onSubmit={handleAddPlayer}
      onSubmissionStart={onSubmissionStart}
      onAbort={onAbort}
      submitButtonText="Add Player"
    />
  );
}
