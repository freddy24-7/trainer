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
  buttonCancel,
  confirmGoalModalHeader,
  confirmGoalModalBody,
  buttonConfirm,
} from '@/strings/clientStrings';
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
        <ModalHeader>{confirmGoalModalHeader}</ModalHeader>
        <ModalBody>
          <p>
            {confirmGoalModalBody} <strong>{goalScorer.username}</strong>?
          </p>
        </ModalBody>
        <ModalFooter>
          <CustomButton color="danger" onPress={onCancel}>
            {buttonCancel}
          </CustomButton>
          <CustomButton color="primary" onPress={onConfirm}>
            {buttonConfirm}
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmGoalModal;
