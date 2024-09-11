// This component is a client-side implementation of the Player Management feature.

'use client';

import { useEffect, useState, useRef } from 'react';
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

export default function PlayerManagementClient() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<ReactNode>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [editPlayerData, setEditPlayerData] = useState<Player | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref to store the start time of the player submission
  const submissionStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchPlayersAsync = async () => {
      abortControllerRef.current = new AbortController();

      try {
        await fetchPlayers();
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    void fetchPlayersAsync();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchPlayers = async () => {
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await getPlayers();
      if (response.success && response.players) {
        const sanitizedPlayers = response.players.map((player) => ({
          id: player.id,
          username: player.username ?? '',
        }));
        setPlayers(sanitizedPlayers);

        // Calculate the elapsed time if submissionStartTimeRef is set
        if (submissionStartTimeRef.current) {
          const endTime = performance.now();
          const elapsedTime = endTime - submissionStartTimeRef.current;
          console.log(
            `Time from submission to display: ${elapsedTime.toFixed(2)} ms`
          );
          submissionStartTimeRef.current = null; // Reset after logging
        }
      } else {
        setError(response.error || 'Error fetching players.');
      }
    } catch (err) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setError('Failed to fetch players.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    setSubmitting(false);
    await fetchPlayers();
  };

  const handleStartSubmission = () => {
    setSubmitting(true);
    submissionStartTimeRef.current = performance.now();
  };

  const handleAbort = () => {
    abortControllerRef.current?.abort();
    setSubmitting(false);
    setLoading(false);
    setError(null);
    setPlayers([]);
  };

  const handlePlayerEdited = async () => {
    setSubmitting(false);
    await fetchPlayers();
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
        await fetchPlayers();
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

      {(loading || submitting) && (
        <div className="flex justify-center my-4">
          <Spinner size="lg" color="primary" />
        </div>
      )}

      {!loading && !submitting && (
        <>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : players.length > 0 ? (
            <ul className="space-y-2">
              {players.map((player) => (
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

      {/* Reusable Modal for edit and delete actions */}
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
