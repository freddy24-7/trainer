import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React from 'react';

import CustomButton from '@/components/Button';
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
        <CustomButton color="danger" onPress={onNo}>
          No
        </CustomButton>
        <CustomButton color="primary" onPress={onYes}>
          Yes
        </CustomButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default AskAddAssistModal;
