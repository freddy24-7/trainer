'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState, useEffect, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';
import { Player } from '@/types/user-types';

interface PlayerManagementProps {
  players: Player[];
  playerValues: MatchFormValues['players'];
  setValue: UseFormSetValue<MatchFormValues>;
  matchEvents: MatchFormValues['matchEvents'];
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  setValue,
  matchEvents,
}) => {
  const [playerStates, setPlayerStates] = useState<
    Record<number, 'playing' | 'bench' | 'absent'>
  >(players.reduce((acc, player) => ({ ...acc, [player.id]: 'absent' }), {}));

  const [matchDuration, setMatchDuration] = useState(70);
  const {
    isOpen: isSubstitutionModalOpen,
    onOpen: onSubstitutionModalOpen,
    onOpenChange: onSubstitutionModalClose,
  } = useDisclosure();

  const [isLineupModalOpen, setLineupModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const [minute, setMinute] = useState<number | ''>('');
  const [playerOutId, setPlayerOutId] = useState<number | null>(null);
  const [playerInId, setPlayerInId] = useState<number | null>(null);
  const [startingLineup, setStartingLineup] = useState<number[]>([]);

  const handlePlayerStateChange = (
    playerId: number,
    newState: 'playing' | 'bench' | 'absent'
  ) => {
    setPlayerStates((prev) => ({
      ...prev,
      [playerId]: newState,
    }));
    if (newState === 'playing' && !startingLineup.includes(playerId)) {
      setStartingLineup((prev) => [...prev, playerId]);
    } else if (newState !== 'playing') {
      setStartingLineup((prev) => prev.filter((id) => id !== playerId));
    }
  };

  const handleConfirmSubstitution = () => {
    if (minute === '' || !playerInId || !playerOutId) {
      alert('Please complete all substitution fields.');
      return;
    }

    if (playerOutId === playerInId) {
      alert('A player cannot be both going out and coming in.');
      return;
    }

    const newMatchEvent = {
      playerInId,
      playerOutId,
      minute,
      eventType: 'SUBSTITUTION_IN' as const,
    };

    setValue('matchEvents', [...(matchEvents || []), newMatchEvent]);

    setPlayerStates((prev) => ({
      ...prev,
      [playerOutId]: 'bench',
      [playerInId]: 'playing',
    }));

    onSubstitutionModalClose();
    setMinute('');
    setPlayerOutId(null);
    setPlayerInId(null);
  };

  const calculatePlayerMinutes = () => {
    const playerMinutes: Record<number, number> = {};
    const substitutionEvents: {
      minute: number;
      type: 'in' | 'out';
      playerId: number;
    }[] = [];

    (matchEvents || []).forEach((matchEvent) => {
      if (matchEvent.eventType === 'SUBSTITUTION_IN') {
        if (matchEvent.playerInId) {
          substitutionEvents.push({
            minute: matchEvent.minute,
            type: 'in',
            playerId: matchEvent.playerInId,
          });
        }
        if (matchEvent.playerOutId) {
          substitutionEvents.push({
            minute: matchEvent.minute,
            type: 'out',
            playerId: matchEvent.playerOutId,
          });
        }
      }
    });

    substitutionEvents.sort((a, b) => a.minute - b.minute);

    players.forEach((player) => {
      let totalMinutes = 0;
      let lastInMinute: number | null = null;

      if (startingLineup.includes(player.id)) {
        lastInMinute = 0;
      }

      substitutionEvents.forEach((matchEvent) => {
        if (matchEvent.playerId === player.id) {
          if (matchEvent.type === 'in') {
            lastInMinute = matchEvent.minute;
          } else if (matchEvent.type === 'out') {
            if (lastInMinute !== null) {
              totalMinutes += matchEvent.minute - lastInMinute;
            }
            lastInMinute = null;
          }
        }
      });

      if (lastInMinute !== null) {
        totalMinutes += matchDuration - lastInMinute;
      }

      playerMinutes[player.id] = totalMinutes;
    });

    return playerMinutes;
  };

  const playerMinutes = useMemo(
    () => calculatePlayerMinutes(),
    [matchEvents, startingLineup, matchDuration]
  );

  useEffect(() => {
    const updatedPlayers = players.map((player) => ({
      id: player.id,
      minutes: playerMinutes[player.id] || 0,
      available: true,
    }));

    setValue('players', updatedPlayers);
  }, [playerMinutes, players, setValue]);

  const handleOpenLineupModal = () => setLineupModalOpen(true);

  const handleConfirmLineup = () => {
    const allPlayersCategorized = players.every(
      (player) => playerStates[player.id] !== undefined
    );
    if (!allPlayersCategorized) {
      alert('Please categorize all players before confirming.');
      return;
    }
    setLineupModalOpen(false);
    setConfirmModalOpen(true);
  };

  const handleFinalConfirmation = () => {
    setFinalized(true);
    setConfirmModalOpen(false);

    setValue(
      'players',
      players.map((player) => ({
        id: player.id,
        state: playerStates[player.id],
        minutes: 0,
        available: true,
      }))
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-center items-center space-x-2">
        <label className="block font-semibold mb-1">Match Duration:</label>
        <input
          type="number"
          value={matchDuration}
          onChange={(e) =>
            setMatchDuration(
              Math.min(130, Math.max(1, parseInt(e.target.value, 10)))
            )
          }
          className="border rounded w-16 p-2"
          min={1}
          max={130}
        />
      </div>

      {!finalized && (
        <div className="flex flex-col items-center space-y-4 mt-4">
          <Button
            className="bg-primary"
            color="primary"
            onPress={handleOpenLineupModal}
          >
            Set Line-up
          </Button>
        </div>
      )}

      <Modal isOpen={isLineupModalOpen} onOpenChange={setLineupModalOpen}>
        <ModalContent>
          <ModalHeader>Select Line-up</ModalHeader>
          <ModalBody>
            {players.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-4 items-center gap-4 mb-2"
              >
                <p className="col-span-1">{player.username}</p>
                <label className="flex items-center gap-2 col-span-1">
                  <input
                    type="radio"
                    name={`player-${player.id}`}
                    value="playing"
                    checked={playerStates[player.id] === 'playing'}
                    onChange={() =>
                      handlePlayerStateChange(player.id, 'playing')
                    }
                  />
                  Playing
                </label>
                <label className="flex items-center gap-2 col-span-1">
                  <input
                    type="radio"
                    name={`player-${player.id}`}
                    value="bench"
                    checked={playerStates[player.id] === 'bench'}
                    onChange={() => handlePlayerStateChange(player.id, 'bench')}
                  />
                  Bench
                </label>
                <label className="flex items-center gap-2 col-span-1">
                  <input
                    type="radio"
                    name={`player-${player.id}`}
                    value="absent"
                    checked={playerStates[player.id] === 'absent'}
                    onChange={() =>
                      handlePlayerStateChange(player.id, 'absent')
                    }
                  />
                  Absent
                </label>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setLineupModalOpen(false)} color="danger">
              Cancel
            </Button>
            <Button onPress={handleConfirmLineup} color="primary">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <ModalContent>
          <ModalHeader>Confirm Line-up</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to confirm this line-up?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setConfirmModalOpen(false)} color="danger">
              Cancel
            </Button>
            <Button onPress={handleFinalConfirmation} color="primary">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {finalized && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Finalized Line-up</h4>
          {players.map((player) => (
            <p key={player.id}>
              {player.username}: {playerStates[player.id]}
            </p>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center space-y-4 mt-4">
        <Button
          className="mt-4 bg-primary"
          color="primary"
          onPress={onSubstitutionModalOpen}
        >
          Manage Substitutions
        </Button>
      </div>

      <Modal
        isOpen={isSubstitutionModalOpen}
        onOpenChange={onSubstitutionModalClose}
      >
        <ModalContent>
          <ModalHeader>Record Substitution</ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Substitution Minute:
              </label>
              <input
                type="number"
                value={minute}
                onChange={(e) => {
                  const value = e.target.value;
                  setMinute(value === '' ? '' : parseInt(value, 10));
                }}
                className="border rounded w-full p-2"
                placeholder="e.g. 19"
              />
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">
                Select Substitutions
              </h4>
              {players.map((player) => (
                <div
                  key={player.id}
                  className="grid grid-cols-4 items-center gap-4 mb-2"
                >
                  <p className="col-span-1">{player.username}</p>
                  {playerStates[player.id] === 'playing' && (
                    <label className="flex items-center gap-2 col-span-1">
                      <input
                        type="radio"
                        name={`substitution-${player.id}`}
                        value="out"
                        checked={playerOutId === player.id}
                        onChange={() => setPlayerOutId(player.id)}
                      />
                      Goes Out
                    </label>
                  )}
                  {playerStates[player.id] === 'bench' && (
                    <label className="flex items-center gap-2 col-span-1">
                      <input
                        type="radio"
                        name={`substitution-${player.id}`}
                        value="in"
                        checked={playerInId === player.id}
                        onChange={() => setPlayerInId(player.id)}
                      />
                      Comes In
                    </label>
                  )}
                </div>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button onPress={onSubstitutionModalClose} color="danger">
              Cancel
            </Button>
            <Button onPress={handleConfirmSubstitution} color="primary">
              Confirm Substitution
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="mt-6 ">
        <h4 className="text-lg font-semibold mb-2">
          Player Minutes (updates on substitutions)
        </h4>
        <div className="grid grid-cols-2 items-center justify-items-start">
          {players.map((player) => (
            <React.Fragment key={player.id}>
              <p className="text-left">{player.username}</p>
              <p className="text-right">{playerMinutes[player.id]} minutes</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerManagement;
