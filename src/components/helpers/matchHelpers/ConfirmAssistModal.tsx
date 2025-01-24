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

interface ConfirmAssistModalProps {
  isOpen: boolean;
  assistProvider: Player | null;
  onCancel: () => void;
  onConfirm: () => void;
}

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
