import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import React from 'react';

import { AskAddAssistModalProps } from '@/types/match-types';

const AskAddAssistModal: React.FC<AskAddAssistModalProps> = ({
  isOpen,
  onYes,
  onNo,
}) => (
  <Modal isOpen={isOpen} backdrop="transparent">
    <ModalContent>
      <ModalHeader>Add Assist?</ModalHeader>
      <ModalBody>
        <p>Would you like to add an assist for this goal?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onPress={onNo}>
          No
        </Button>
        <Button color="primary" onPress={onYes}>
          Yes
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default AskAddAssistModal;
