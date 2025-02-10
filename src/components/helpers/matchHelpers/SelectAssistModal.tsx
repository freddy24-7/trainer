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
  selectAssistProviderHeader,
  noPlayersForAssistMessage,
  buttonCancel,
} from '@/strings/clientStrings';
import { SelectAssistModalProps } from '@/types/match-types';

const SelectAssistModal: React.FC<SelectAssistModalProps> = ({
  isOpen,
  playersOnPitch,
  onSelect,
  onCancel,
}) => (
  <Modal isOpen={isOpen} backdrop="transparent">
    <ModalContent>
      <ModalHeader>{selectAssistProviderHeader}</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2">
          {playersOnPitch.length === 0 && (
            <div>{noPlayersForAssistMessage}</div>
          )}

          {playersOnPitch.map((player) => (
            <CustomButton key={player.id} onPress={() => onSelect(player)}>
              {player.username}
            </CustomButton>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <CustomButton color="danger" onPress={onCancel}>
          {buttonCancel}
        </CustomButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelectAssistModal;
