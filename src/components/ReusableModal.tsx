import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import React, { useCallback } from 'react';

import CustomButton from '@/components/Button';
import {
  defaultConfirmLabel,
  defaultCancelLabel,
} from '@/strings/clientStrings';
import { ReusableModalProps } from '@/types/ui-types';

export default function ReusableModal({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel = defaultConfirmLabel,
  confirmAction,
  cancelLabel = defaultCancelLabel,
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
              <CustomButton
                color="secondary"
                variant="light"
                onPress={handleClose}
              >
                {cancelLabel}
              </CustomButton>
              <CustomButton color="primary" onPress={handleConfirm}>
                {confirmLabel}
              </CustomButton>
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}
