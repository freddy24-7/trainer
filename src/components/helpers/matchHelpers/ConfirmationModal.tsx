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
  confirmSubmissionTitle,
  confirmSubmissionMessage,
  buttonCancel,
  buttonSubmit,
} from '@/strings/clientStrings';
import { ConfirmationModalProps } from '@/types/match-types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = confirmSubmissionTitle,
  message = confirmSubmissionMessage,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <CustomButton onPress={onClose} color="danger">
            {buttonCancel}
          </CustomButton>
          <CustomButton onPress={onConfirm} color="primary">
            {buttonSubmit}
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
