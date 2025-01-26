import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import React, { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import SubstitutionManagementBody from '@/components/helpers/matchHelpers/SubstitutionManagementBody';
import { MatchFormValues } from '@/types/match-types';
import {
  handleConfirmAllAtOnce,
  Substitution,
  SubstitutionReason,
} from '@/utils/substitutionUtils';

interface Player {
  id: number;
  username: string;
}

interface SubstitutionManagementProps {
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  matchEvents: MatchFormValues['matchEvents'];
  onSubstitution: (
    minute: number,
    playerInId: number,
    playerOutId: number,
    substitutionReason: SubstitutionReason
  ) => void;
  setValue: UseFormSetValue<MatchFormValues>;
  setPlayerStates: React.Dispatch<
    React.SetStateAction<Record<number, 'playing' | 'bench' | 'absent'>>
  >;
}

const SubstitutionManagement: React.FC<SubstitutionManagementProps> = ({
  players,
  playerStates,
  matchEvents,
  setValue,
  setPlayerStates,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [minute, setMinute] = useState<number | ''>('');
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);

  return (
    <>
      <Button onPress={() => setOpen(true)} color="primary">
        Manage Substitutions
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Record Substitutions</ModalHeader>

          <ModalBody>
            <SubstitutionManagementBody
              players={players}
              playerStates={playerStates}
              minute={minute}
              setMinute={setMinute}
              substitutions={substitutions}
              setSubstitutions={setSubstitutions}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              onPress={() =>
                handleConfirmAllAtOnce({
                  minute,
                  substitutions,
                  matchEvents,
                  playerStates,
                  setValue,
                  setPlayerStates,
                  setOpen,
                  setMinute,
                  setSubstitutions,
                })
              }
              color="primary"
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubstitutionManagement;
