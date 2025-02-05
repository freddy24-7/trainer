'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React, { useState } from 'react';

import CustomButton from '@/components/Button';
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
      <CustomButton onPress={() => setOpen(true)} color="primary">
        Set Line-up
      </CustomButton>
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
            <CustomButton onPress={() => setOpen(false)} color="danger">
              Cancel
            </CustomButton>
            <CustomButton onPress={handleConfirm} color="primary">
              Confirm
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LineupManagement;
