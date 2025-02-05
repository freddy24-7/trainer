import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React from 'react';

import CustomButton from '@/components/Button';
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
              <ModalHeader>Select Opponent Strength</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <CustomButton onPress={() => setSelectedStrength('STRONGER')}>
                    Stronger
                  </CustomButton>
                  <CustomButton onPress={() => setSelectedStrength('SIMILAR')}>
                    Similar
                  </CustomButton>
                  <CustomButton onPress={() => setSelectedStrength('WEAKER')}>
                    Weaker
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
              <ModalHeader>Confirm Strength Selection</ModalHeader>
              <ModalBody>
                Are you sure you want to select
                <strong>{selectedStrength}</strong> as the opponent&apos;s
                strength?
              </ModalBody>
              <ModalFooter>
                <CustomButton color="danger" onPress={onClose}>
                  Cancel
                </CustomButton>
                <CustomButton
                  color="primary"
                  onPress={() => {
                    handleConfirmStrength();
                    onClose();
                  }}
                >
                  Confirm
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
