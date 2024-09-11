// This component is a client-side implementation of the Player Management feature.

'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AddPlayerForm from '@/components/AddPlayerForm';
import EditPlayerForm from '@/components/EditPlayerForm';
import { getPlayers } from '@/app/actions/getPlayers';
import { deletePlayer } from '@/app/actions/deletePlayer';
import { Spinner } from '@nextui-org/spinner';
import { Card, CardHeader, CardBody, Divider, Button } from '@nextui-org/react';
import ReusableModal from '@/components/ReusableModal';
import type { ReactNode } from 'react';

interface Player {
  id: number;
  username: string;
}

type GetPlayersResponse = {
  success: boolean;
  players?: Player[];
  error?: string;
};

export default function PlayerManagementClient() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<ReactNode>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [editPlayerData, setEditPlayerData] = useState<Player | null>(null);

  // Ref to store the start time of the player submission
  const submissionStartTimeRef = useRef<number | null>(null);

  // Using React Query to fetch players
  const {
    data,
    isLoading,
    refetch,
    error: queryError,
  } = useQuery<GetPlayersResponse, Error>({
    queryKey: ['players'], // Query key explicitly as an array
    queryFn: async () => await getPlayers(),
  });

  const players = data?.players || [];

  // Logging the time taken when the data changes and the player list is updated
  useEffect(() => {
    if (submissionStartTimeRef.current !== null && data && data.players) {
      const endTime = performance.now();
      const elapsedTime = endTime - submissionStartTimeRef.current;
      console.log(
        `Time from submission to display: ${elapsedTime.toFixed(2)} ms`
      );
      submissionStartTimeRef.current = null; // Reset after logging
    }
  }, [data]);

  if (queryError) {
    setError(queryError.message || 'Failed to fetch players.');
  }

  if (data && !data.success) {
    setError(data.error || 'Error fetching players.');
  }

  const handleAddPlayer = async () => {
    setSubmitting(false);
    await refetch();
  };

  const handleStartSubmission = () => {
    setSubmitting(true);
    submissionStartTimeRef.current = performance.now(); // Start the timer when the submission starts
  };

  const handleAbort = () => {
    setSubmitting(false);
    setError(null);
  };

  const handlePlayerEdited = async () => {
    setSubmitting(false);
    await refetch();
    setEditPlayerData(null);
    setIsModalOpen(false);
  };

  const handleEditPlayer = (player: Player) => {
    setEditPlayerData(player);
    setModalTitle('Edit Player');
    setIsModalOpen(true);
  };

  const handleDeletePlayer = (playerId: number) => {
    setModalTitle('Confirm Deletion');
    setModalBody(<p>Are you sure you want to delete this player?</p>);
    setConfirmAction(() => async () => {
      const response = await deletePlayer(playerId);
      if (response.success) {
        setModalBody(<p>Player deleted successfully!</p>);
        await refetch();
      } else {
        setModalBody(<p className="text-red-500">{response.error}</p>);
      }
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mt-8 mb-4 text-black">
        Player Management
      </h3>
      <AddPlayerForm
        onPlayerAdded={handleAddPlayer}
        onSubmissionStart={handleStartSubmission}
        onAbort={handleAbort}
      />

      <h3 className="text-lg font-semibold mt-8 mb-4 text-black">
        Current Players
      </h3>

      {(isLoading || submitting) && (
        <div className="flex justify-center my-4">
          <Spinner size="lg" color="success" />
        </div>
      )}

      {!isLoading && !submitting && (
        <>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : players.length > 0 ? (
            <ul className="space-y-2">
              {players.map((player: Player) => (
                <Card key={player.id} className="max-w-md mx-auto mb-4">
                  <CardHeader className="flex justify-between items-center">
                    <span className="text-md">{player.username}</span>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="flex justify-end space-x-2">
                      <Button
                        color="primary"
                        onClick={() => handleEditPlayer(player)}
                        className="text-sm px-2 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleDeletePlayer(player.id)}
                        className="text-sm px-2 py-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </ul>
          ) : (
            <p>No players have been added yet.</p>
          )}
        </>
      )}

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditPlayerData(null);
        }}
        title={modalTitle}
        body={
          editPlayerData ? (
            <EditPlayerForm
              playerId={editPlayerData.id}
              initialUsername={editPlayerData.username}
              onPlayerEdited={handlePlayerEdited}
              onSubmissionStart={handleStartSubmission}
              onAbort={handleAbort}
            />
          ) : (
            modalBody
          )
        }
        confirmAction={editPlayerData ? undefined : confirmAction}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        cancelAction={() => {
          setIsModalOpen(false);
          setEditPlayerData(null);
        }}
      />
    </div>
  );
}
