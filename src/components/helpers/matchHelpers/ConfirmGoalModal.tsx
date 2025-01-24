import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React from 'react';

import { Player } from '@/types/user-types';

interface ConfirmGoalModalProps {
  isOpen: boolean;
  goalScorer: Player | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmGoalModal: React.FC<ConfirmGoalModalProps> = ({
  isOpen,
  goalScorer,
  onCancel,
  onConfirm,
}) => {
  if (!goalScorer) return null;

  return (
    <Modal isOpen={isOpen} backdrop="transparent">
      <ModalContent>
        <ModalHeader>Confirm Goal</ModalHeader>
        <ModalBody>
          <p>
            Confirm goal for <strong>{goalScorer.username}</strong>?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onCancel}>
            Cancel
          </Button>
          <Button color="primary" onPress={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmGoalModal;
