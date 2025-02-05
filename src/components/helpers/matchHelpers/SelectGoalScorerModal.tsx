import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React from 'react';

import CustomButton from '@/components/Button';
import { SelectGoalScorerModalProps } from '@/types/match-types';

const SelectGoalScorerModal: React.FC<SelectGoalScorerModalProps> = ({
  isOpen,
  playersOnPitch,
  onSelect,
  onCancel,
}) => (
  <Modal isOpen={isOpen} backdrop="transparent">
    <ModalContent>
      <ModalHeader>Select Goal Scorer</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2">
          {playersOnPitch.length === 0 && (
            <div>No players on pitch to choose from</div>
          )}
          {playersOnPitch.map((player) => (
            <CustomButton key={player.id} onPress={() => onSelect(player)}>
              {player.username}
            </CustomButton>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <CustomButton color="danger" onPress={onCancel}>
          Cancel
        </CustomButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelectGoalScorerModal;
