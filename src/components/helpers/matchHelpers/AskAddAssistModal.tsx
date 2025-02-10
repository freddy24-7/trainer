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
  buttonNo,
  buttonYes,
  addAssistModalHeader,
  addAssistModalBody,
} from '@/strings/clientStrings';
import { AskAddAssistModalProps } from '@/types/match-types';

const AskAddAssistModal: React.FC<AskAddAssistModalProps> = ({
  isOpen,
  onYes,
  onNo,
}) => (
  <Modal isOpen={isOpen} backdrop="transparent">
    <ModalContent>
      <ModalHeader>{addAssistModalHeader}</ModalHeader>
      <ModalBody>
        <p>{addAssistModalBody}</p>
      </ModalBody>
      <ModalFooter>
        <CustomButton color="danger" onPress={onNo}>
          {buttonNo}
        </CustomButton>
        <CustomButton color="primary" onPress={onYes}>
          {buttonYes}
        </CustomButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default AskAddAssistModal;
