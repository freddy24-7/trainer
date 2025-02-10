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
  selectOpponentStrengthHeader,
  strongerButton,
  similarButton,
  weakerButton,
  confirmStrengthSelectionHeader,
  buttonCancel,
  buttonConfirm,
} from '@/strings/clientStrings';
import { StrengthModalProps } from '@/types/match-types';

const StrengthModal: React.FC<StrengthModalProps> = ({
  isOpen,
  onOpenChange,
  isConfirmOpen,
  onConfirmOpen,
  onConfirmChange,
  selectedStrength,
  setSelectedStrength,
  handleConfirmStrength,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{selectOpponentStrengthHeader}</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <CustomButton onPress={() => setSelectedStrength('STRONGER')}>
                    {strongerButton}
                  </CustomButton>
                  <CustomButton onPress={() => setSelectedStrength('SIMILAR')}>
                    {similarButton}
                  </CustomButton>
                  <CustomButton onPress={() => setSelectedStrength('WEAKER')}>
                    {weakerButton}
                  </CustomButton>
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton color="danger" onPress={onClose}>
                  Cancel
                </CustomButton>
                <CustomButton
                  color="primary"
                  onPress={() => {
                    onClose();
                    if (selectedStrength) {
                      onConfirmOpen();
                    }
                  }}
                >
                  Confirm
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{confirmStrengthSelectionHeader}</ModalHeader>
              <ModalBody>
                Ben je zeker dat je
                <strong>{selectedStrength}</strong> wilt selecteren als de
                sterkte van de tegenstander?
              </ModalBody>
              <ModalFooter>
                <CustomButton color="danger" onPress={onClose}>
                  {buttonCancel}
                </CustomButton>
                <CustomButton
                  color="primary"
                  onPress={() => {
                    handleConfirmStrength();
                    onClose();
                  }}
                >
                  {buttonConfirm}
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default StrengthModal;
