import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React from 'react';

interface AskAddAssistModalProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
}

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
