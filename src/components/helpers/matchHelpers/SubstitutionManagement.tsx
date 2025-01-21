import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React, { useState } from 'react';

import SubstitutionManagementBody from '@/components/helpers/matchHelpers/SubstitutionManagementBody';
import {
  handleConfirm,
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
            <Button onPress={() => setOpen(false)} color="danger">
              Cancel
            </Button>
            <Button
              onPress={() =>
                handleConfirm({
                  minute,
                  substitutions,
                  onSubstitution,
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
