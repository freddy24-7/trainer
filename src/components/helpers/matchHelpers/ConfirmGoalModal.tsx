import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React from 'react';

import CustomButton from '@/components/Button';
import { ConfirmGoalModalProps } from '@/types/match-types';

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
          <CustomButton color="danger" onPress={onCancel}>
            Cancel
          </CustomButton>
          <CustomButton color="primary" onPress={onConfirm}>
            Confirm
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmGoalModal;
