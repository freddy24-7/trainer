'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import React, { useState } from 'react';

import { Player } from '@/types/user-types';

const LineupManagement: React.FC<{
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  onPlayerStateChange: (
    playerId: number,
    newState: 'playing' | 'bench' | 'absent'
  ) => void;
  onConfirm: () => void;
}> = ({ players, playerStates, onPlayerStateChange, onConfirm }) => {
  const [isOpen, setOpen] = useState(false);

  const handleConfirm = (): void => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <Button onPress={() => setOpen(true)} color="primary">
        Set Line-up
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Select Line-up</ModalHeader>
          <ModalBody>
            {players.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-4 items-center gap-4 mb-2"
              >
                <p>{player.username}</p>
                {(['playing', 'bench', 'absent'] as const).map((state) => (
                  <label key={state} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`player-${player.id}`}
                      value={state}
                      checked={playerStates[player.id] === state}
                      onChange={() => onPlayerStateChange(player.id, state)}
                    />
                    {state}
                  </label>
                ))}
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

export default LineupManagement;
