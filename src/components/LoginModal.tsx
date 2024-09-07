//This component is a modal that displays a message to the user when they are not logged in.
'use client';

import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

export default function LoginModal() {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
  const router = useRouter();

  const handleClose = (onClose: () => void) => {
    onClose();
    router.push('/');
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Log In Required
            </ModalHeader>
            <ModalBody>
              <p>You need to be logged in to access the dashboard.</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => handleClose(onClose)}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
