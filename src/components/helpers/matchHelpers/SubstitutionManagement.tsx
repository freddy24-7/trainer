'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React, { useState } from 'react';

import { Player } from '@/types/user-types';

const SubstitutionManagement: React.FC<{
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  onSubstitution: (
    minute: number,
    playerInId: number,
    playerOutId: number
  ) => void;
}> = ({ players, playerStates, onSubstitution }) => {
  const [isOpen, setOpen] = useState(false);
  const [minute, setMinute] = useState<number | ''>('');
  const [playerInId, setPlayerInId] = useState<number | null>(null);
  const [playerOutId, setPlayerOutId] = useState<number | null>(null);

  const handleConfirm = (): void => {
    if (!minute || !playerInId || !playerOutId) {
      alert('Please complete all fields.');
      return;
    }
    onSubstitution(minute as number, playerInId, playerOutId);
    setOpen(false);
    setMinute('');
    setPlayerInId(null);
    setPlayerOutId(null);
  };

  return (
    <>
      <Button onPress={() => setOpen(true)} color="primary">
        Manage Substitutions
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Record Substitution</ModalHeader>
          <ModalBody>
            <input
              type="number"
              placeholder="Minute"
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
              className="border rounded w-full p-2"
            />
            {players.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-4 items-center gap-4 mb-2"
              >
                <p>{player.username}</p>
                {playerStates[player.id] === 'playing' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={player.id}
                      checked={playerOutId === player.id}
                      onChange={() => setPlayerOutId(player.id)}
                    />
                    Goes Out
                  </label>
                )}
                {playerStates[player.id] === 'bench' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={player.id}
                      checked={playerInId === player.id}
                      onChange={() => setPlayerInId(player.id)}
                    />
                    Comes In
                  </label>
                )}
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setOpen(false)} color="danger">
              Cancel
            </Button>
            <Button onPress={handleConfirm} color="primary">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubstitutionManagement;
