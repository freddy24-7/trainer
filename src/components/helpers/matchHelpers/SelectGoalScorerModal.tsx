import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React from 'react';

import CustomButton from '@/components/Button';
import {
  selectGoalScorerHeader,
  noPlayersOnPitchMessage,
  buttonCancel,
} from '@/strings/clientStrings';
import { SelectGoalScorerModalProps } from '@/types/match-types';

const SelectGoalScorerModal: React.FC<SelectGoalScorerModalProps> = ({
  isOpen,
  playersOnPitch,
  onSelect,
  onCancel,
}) => (
  <Modal isOpen={isOpen} backdrop="transparent">
    <ModalContent>
      <ModalHeader>{selectGoalScorerHeader}</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2">
          {playersOnPitch.length === 0 && <div>{noPlayersOnPitchMessage}</div>}

          {playersOnPitch.map((player) => (
            <CustomButton key={player.id} onPress={() => onSelect(player)}>
              {player.username}
            </CustomButton>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <CustomButton color="danger" onPress={onCancel}>
          {buttonCancel}
        </CustomButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelectGoalScorerModal;
