import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React, { useState } from 'react';

import GoalAssistModalBody from '@/components/helpers/matchHelpers/GoalAssistModalBody';
import { resetState } from '@/utils/goalAssistUtils';

interface Player {
  id: number;
  username: string;
}

interface GoalAssistModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  onConfirm: (playerId: number, eventType: 'GOAL' | 'ASSIST') => void;
}

const GoalAssistModal: React.FC<GoalAssistModalProps> = ({
  isOpen,
  onOpenChange,
  players,
  playerStates,
  onConfirm,
}) => {
  const [goalScorer, setGoalScorer] = useState<number | null>(null);
  const [assistProvider, setAssistProvider] = useState<number | null>(null);

  const playersOnPitch = players.filter(
    (player) => playerStates[player.id] === 'playing'
  );

  const handleConfirm = (): void => {
    resetState({ setGoalScorer, setAssistProvider, onOpenChange, onConfirm });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {goalScorer ? 'Record Assist' : 'Record Goal'}
            </ModalHeader>
            <ModalBody>
              <GoalAssistModalBody
                goalScorer={goalScorer}
                setGoalScorer={setGoalScorer}
                assistProvider={assistProvider}
                setAssistProvider={setAssistProvider}
                playersOnPitch={playersOnPitch}
                onConfirm={onConfirm}
                onOpenChange={onOpenChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                disabled={!goalScorer}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GoalAssistModal;
