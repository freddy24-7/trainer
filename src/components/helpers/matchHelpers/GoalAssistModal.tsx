import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React, { useState, useEffect } from 'react';

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

type ModalStep =
  | 'SELECT_GOAL_SCORER'
  | 'CONFIRM_GOAL'
  | 'ASK_ADD_ASSIST'
  | 'SELECT_ASSIST'
  | 'CONFIRM_ASSIST'
  | 'CLOSED';

const GoalAssistModal: React.FC<GoalAssistModalProps> = ({
  isOpen,
  onOpenChange,
  players,
  playerStates,
  onConfirm,
}) => {
  const [step, setStep] = useState<ModalStep>('CLOSED');

  const playersOnPitch = players.filter(
    (player) => playerStates[player.id] === 'playing'
  );

  const [goalScorer, setGoalScorer] = useState<Player | null>(null);
  const [assistProvider, setAssistProvider] = useState<Player | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('SELECT_GOAL_SCORER');
    } else {
      setStep('CLOSED');
      setGoalScorer(null);
      setAssistProvider(null);
    }
  }, [isOpen]);

  const handleCloseAll = () => {
    onOpenChange(false);
    setStep('CLOSED');
    setGoalScorer(null);
    setAssistProvider(null);
  };

  const SelectGoalScorerModal = () => (
    <Modal
      isOpen={step === 'SELECT_GOAL_SCORER'}
      onOpenChange={onOpenChange}
      backdrop="transparent"
    >
      <ModalContent>
        <ModalHeader>Select Goal Scorer</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            {playersOnPitch.length === 0 && (
              <div>No players on pitch to choose from</div>
            )}
            {playersOnPitch.map((player) => (
              <Button
                key={player.id}
                onPress={() => {
                  setGoalScorer(player);
                  setStep('CONFIRM_GOAL');
                }}
              >
                {player.username}
              </Button>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={handleCloseAll}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ConfirmGoalModal = () => {
    if (!goalScorer) return null;
    return (
      <Modal
        isOpen={step === 'CONFIRM_GOAL'}
        onOpenChange={onOpenChange}
        backdrop="transparent"
      >
        <ModalContent>
          <ModalHeader>Confirm Goal</ModalHeader>
          <ModalBody>
            <p>
              Confirm goal for <strong>{goalScorer.username}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => {
                setStep('SELECT_GOAL_SCORER');
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => {
                onConfirm(goalScorer.id, 'GOAL');
                setStep('ASK_ADD_ASSIST');
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const AskAddAssistModal = () => (
    <Modal
      isOpen={step === 'ASK_ADD_ASSIST'}
      onOpenChange={onOpenChange}
      backdrop="transparent"
    >
      <ModalContent>
        <ModalHeader>Add Assist?</ModalHeader>
        <ModalBody>
          <p>Would you like to add an assist for this goal?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onPress={() => {
              handleCloseAll();
            }}
          >
            No
          </Button>
          <Button
            color="primary"
            onPress={() => {
              setStep('SELECT_ASSIST');
            }}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const SelectAssistModal = () => (
    <Modal
      isOpen={step === 'SELECT_ASSIST'}
      onOpenChange={onOpenChange}
      backdrop="transparent"
    >
      <ModalContent>
        <ModalHeader>Select Assist Provider</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            {playersOnPitch
              .filter((p) => p.id !== goalScorer?.id)
              .map((player) => (
                <Button
                  key={player.id}
                  onPress={() => {
                    setAssistProvider(player);
                    setStep('CONFIRM_ASSIST');
                  }}
                >
                  {player.username}
                </Button>
              ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onPress={() => {
              setStep('ASK_ADD_ASSIST');
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ConfirmAssistModal = () => {
    if (!assistProvider) return null;
    return (
      <Modal
        isOpen={step === 'CONFIRM_ASSIST'}
        onOpenChange={onOpenChange}
        backdrop="transparent"
      >
        <ModalContent>
          <ModalHeader>Confirm Assist</ModalHeader>
          <ModalBody>
            <p>
              Confirm assist for <strong>{assistProvider.username}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => {
                setAssistProvider(null);
                setStep('ASK_ADD_ASSIST');
              }}
            >
              No
            </Button>
            <Button
              color="primary"
              onPress={() => {
                onConfirm(assistProvider.id, 'ASSIST');
                handleCloseAll();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      <SelectGoalScorerModal />
      <ConfirmGoalModal />
      <AskAddAssistModal />
      <SelectAssistModal />
      <ConfirmAssistModal />
    </>
  );
};

export default GoalAssistModal;
