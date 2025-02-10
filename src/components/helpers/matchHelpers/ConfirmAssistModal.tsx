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
  confirmAssistModalHeader,
  confirmAssistModalBody,
} from '@/strings/clientStrings';
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
        <ModalHeader>{confirmAssistModalHeader}</ModalHeader>
        <ModalBody>
          <p>
            <p>
              {confirmAssistModalBody}{' '}
              <strong>{assistProvider.username}</strong>?
            </p>
          </p>
        </ModalBody>
        <ModalFooter>
          <CustomButton color="danger" onPress={onCancel}>
            {buttonNo}
          </CustomButton>
          <CustomButton color="primary" onPress={onConfirm}>
            {buttonYes}
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAssistModal;
