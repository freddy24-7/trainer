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

type SubstitutionReason = 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;

interface Substitution {
  playerOutId: number;
  playerInId: number | null;
  substitutionReason: SubstitutionReason;
}

interface SubstitutionManagementProps {
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  onSubstitution: (
    minute: number,
    playerInId: number,
    playerOutId: number,
    substitutionReason: SubstitutionReason
  ) => void;
}

const SubstitutionManagement: React.FC<SubstitutionManagementProps> = ({
  players,
  playerStates,
  onSubstitution,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [minute, setMinute] = useState<number | ''>('');
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);

  const handleSubstitutionChange = (
    playerOutId: number,
    field: 'playerInId' | 'substitutionReason',
    value: string | number
  ): void => {
    const parsedValue =
      field === 'playerInId' ? Number(value) : (value as SubstitutionReason);

    setSubstitutions((prev) =>
      prev.map((sub) =>
        sub.playerOutId === playerOutId ? { ...sub, [field]: parsedValue } : sub
      )
    );
  };

  const handleAddSubstitution = (playerOutId: number): void => {
    setSubstitutions((prev) => [
      ...prev,
      { playerOutId, playerInId: null, substitutionReason: null },
    ]);
  };

  const handleRemoveSubstitution = (playerOutId: number): void => {
    setSubstitutions((prev) =>
      prev.filter((sub) => sub.playerOutId !== playerOutId)
    );
  };

  const handleConfirm = (): void => {
    if (
      !minute ||
      substitutions.some((sub) => !sub.playerInId || !sub.substitutionReason)
    ) {
      alert('Please complete all fields for each substitution.');
      return;
    }

    substitutions.forEach((sub) => {
      onSubstitution(
        minute as number,
        sub.playerInId as number,
        sub.playerOutId,
        sub.substitutionReason
      );
    });

    setOpen(false);
    setMinute('');
    setSubstitutions([]);
  };

  return (
    <>
      <Button onPress={() => setOpen(true)} color="primary">
        Manage Substitutions
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Record Substitutions</ModalHeader>
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
                className="grid grid-cols-5 items-center gap-4 mb-2"
              >
                <p>{player.username}</p>
                {playerStates[player.id] === 'playing' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={substitutions.some(
                        (sub) => sub.playerOutId === player.id
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleAddSubstitution(player.id);
                        } else {
                          handleRemoveSubstitution(player.id);
                        }
                      }}
                    />
                    Goes Out
                  </label>
                )}
                {substitutions.some((sub) => sub.playerOutId === player.id) && (
                  <>
                    <select
                      className="border rounded p-2"
                      value={
                        substitutions.find(
                          (sub) => sub.playerOutId === player.id
                        )?.playerInId || ''
                      }
                      onChange={(e) =>
                        handleSubstitutionChange(
                          player.id,
                          'playerInId',
                          Number(e.target.value)
                        )
                      }
                    >
                      <option value="" disabled={true}>
                        Comes In
                      </option>
                      {players
                        .filter((p) => playerStates[p.id] === 'bench')
                        .map((benchPlayer) => (
                          <option key={benchPlayer.id} value={benchPlayer.id}>
                            {benchPlayer.username}
                          </option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                      {['TACTICAL', 'FITNESS', 'INJURY', 'OTHER'].map(
                        (reason) => (
                          <label
                            key={reason}
                            className="flex items-center gap-1"
                          >
                            <input
                              type="radio"
                              name={`reason-${player.id}`}
                              value={reason}
                              checked={
                                substitutions.find(
                                  (sub) => sub.playerOutId === player.id
                                )?.substitutionReason === reason
                              }
                              onChange={() =>
                                handleSubstitutionChange(
                                  player.id,
                                  'substitutionReason',
                                  reason
                                )
                              }
                            />
                            {reason}
                          </label>
                        )
                      )}
                    </div>
                  </>
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
