import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React from 'react';

import CustomButton from '@/components/Button';
import { ConfirmAssistModalProps } from '@/types/match-types';

const ConfirmAssistModal: React.FC<ConfirmAssistModalProps> = ({
  isOpen,
  assistProvider,
  onCancel,
  onConfirm,
}) => {
  if (!assistProvider) return null;

  return (
    <Modal isOpen={isOpen} backdrop="transparent">
      <ModalContent>
        <ModalHeader>Confirm Assist</ModalHeader>
        <ModalBody>
          <p>
            Confirm assist for <strong>{assistProvider.username}</strong>?
          </p>
        </ModalBody>
        <ModalFooter>
          <CustomButton color="danger" onPress={onCancel}>
            No
          </CustomButton>
          <CustomButton color="primary" onPress={onConfirm}>
            Yes
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAssistModal;
