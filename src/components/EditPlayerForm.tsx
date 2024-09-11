// This component is responsible for rendering a form to edit a player.

import PlayerForm from './PlayerForm';
import { editPlayer } from '@/app/actions/editPlayer';

// Defining the props for EditPlayerForm
interface EditPlayerFormProps {
  playerId: number;
  initialUsername: string;
  onPlayerEdited: (updatedPlayer: { id: number; username: string }) => void;
  onSubmissionStart: () => void;
  onAbort: () => void;
}

export default function EditPlayerForm({
  playerId,
  initialUsername,
  onPlayerEdited,
  onSubmissionStart,
  onAbort,
}: EditPlayerFormProps) {
  const handleEditPlayer = async (data: {
    username: string;
    password: string;
  }) => {
    const response = await editPlayer(playerId, data);
    if (response.success) {
      onPlayerEdited({ id: playerId, username: data.username });
    } else {
      throw new Error(response.error || 'Error updating the player.');
    }
  };

  return (
    <PlayerForm
      initialData={{ username: initialUsername, password: '' }}
      onSubmit={handleEditPlayer}
      onSubmissionStart={onSubmissionStart}
      onAbort={onAbort}
      submitButtonText="Update Player"
    />
  );
}
