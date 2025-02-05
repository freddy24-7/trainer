import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React, { useState } from 'react';

import CustomButton from '@/components/Button';
import SubstitutionManagementBody from '@/components/helpers/matchHelpers/SubstitutionManagementBody';
import { SubstitutionManagementProps, Substitution } from '@/types/match-types';
import { handleConfirmAllAtOnce } from '@/utils/substitutionUtils';

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

  const isValid =
    minute !== '' &&
    substitutions.length > 0 &&
    substitutions.some((sub) => sub.playerInId !== null) &&
    substitutions.some((sub) => sub.playerOutId !== null);

  const handleConfirmClick = (): void => {
    if (!isValid) {
      console.error(
        'Validation failed: Select a minute, at least one incoming player, and at least one outgoing player.'
      );
      return;
    }

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
    });
  };

  return (
    <>
      <CustomButton onPress={() => setOpen(true)} color="primary">
        Manage Substitutions
      </CustomButton>

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
            <CustomButton
              onPress={handleConfirmClick}
              color="primary"
              isDisabled={!isValid}
            >
              Confirm
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubstitutionManagement;
