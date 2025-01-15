import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React from 'react';

interface StrengthModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  isConfirmOpen: boolean;
  onConfirmOpen: () => void;
  onConfirmChange: (value: boolean) => void;

  selectedStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  setSelectedStrength: React.Dispatch<
    React.SetStateAction<'STRONGER' | 'SIMILAR' | 'WEAKER' | null>
  >;

  handleConfirmStrength: () => void;
}

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
                  <Button onPress={() => setSelectedStrength('STRONGER')}>
                    Stronger
                  </Button>
                  <Button onPress={() => setSelectedStrength('SIMILAR')}>
                    Similar
                  </Button>
                  <Button onPress={() => setSelectedStrength('WEAKER')}>
                    Weaker
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    if (selectedStrength) {
                      onConfirmOpen();
                    }
                  }}
                >
                  Confirm
                </Button>
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
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleConfirmStrength();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default StrengthModal;
