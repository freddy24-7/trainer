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
import {
  setLineupButtonText,
  selectLineupHeader,
  buttonCancel,
  buttonConfirm,
  playerStatePlaying,
  playerStateBench,
  playerStateAbsent,
} from '@/strings/clientStrings';
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
        {setLineupButtonText}
      </CustomButton>
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>{selectLineupHeader}</ModalHeader>
          <ModalBody>
            {players.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-4 items-center gap-4 mb-2"
              >
                <p>{player.username}</p>
                {(
                  [
                    { key: 'playing', label: playerStatePlaying },
                    { key: 'bench', label: playerStateBench },
                    { key: 'absent', label: playerStateAbsent },
                  ] as const
                ).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`player-${player.id}`}
                      value={key}
                      checked={playerStates[player.id] === key}
                      onChange={() => onPlayerStateChange(player.id, key)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <CustomButton onPress={() => setOpen(false)} color="danger">
              {buttonCancel}
            </CustomButton>
            <CustomButton onPress={handleConfirm} color="primary">
              {buttonConfirm}
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LineupManagement;
