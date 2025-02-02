import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import React from 'react';

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
          <Button color="danger" onPress={onCancel}>
            No
          </Button>
          <Button color="primary" onPress={onConfirm}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAssistModal;
