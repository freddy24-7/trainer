import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React, { useCallback } from 'react';

import { ReusableModalProps } from '@/types/ui-types';

export default function ReusableModal({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel = 'Confirm',
  confirmAction,
  cancelLabel = 'Cancel',
  cancelAction,
}: ReusableModalProps): React.ReactElement {
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
