// This is a reusable modal component

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { ReactNode, useCallback } from 'react';

// Define the props for the reusable modal component
interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  confirmAction?: () => void;
  cancelLabel?: string;
  cancelAction?: () => void;
}

export default function ReusableModal({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel = 'Confirm',
  confirmAction,
  cancelLabel = 'Cancel',
  cancelAction,
}: ReusableModalProps) {
  const handleClose = useCallback(() => {
    if (cancelAction) cancelAction();
    onClose();
  }, [onClose, cancelAction]);

  const handleConfirm = useCallback(() => {
    if (confirmAction) confirmAction();
    onClose();
  }, [onClose, confirmAction]);

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>{body}</ModalBody>
          {/* Conditionally rendering footer buttons only if confirmAction is provided */}
          {confirmAction && (
            <ModalFooter>
              <Button color="secondary" variant="light" onPress={handleClose}>
                {cancelLabel}
              </Button>
              <Button color="primary" onPress={handleConfirm}>
                {confirmLabel}
              </Button>
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}
