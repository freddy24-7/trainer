import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import React from 'react';

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
            <Button key={player.id} onPress={() => onSelect(player)}>
              {player.username}
            </Button>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onPress={onCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelectGoalScorerModal;
